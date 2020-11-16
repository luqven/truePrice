/**********************************************************************
 * Inherits from Scraper Class
 * **********************************************************************
 * Scraper {
 *   type: 'ebay',
 *   url: 'https://www.ebay.com/sch/i.html?_fr...',
 *   test: true || false,
 *   testsPath: '../../tests/ebay.html',
 *   verbose: false
 *   browserSettings: {
 *     args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
 *     viewport: { width: 1792, height: 934 },
 *     timeout: 15000
 *   },
 *  parseFilter: Function(),
 * ...
 * }
 *
 * **********************************************************************/

const path = require('path');
const puppeteer = require('puppeteer');

const {Scraper} = require('../../scraper/index');
const {validateProps} = require('./validations');
const config = require('./config');
const {copyFile} = require('fs');

class Ebay extends Scraper {
  constructor(props) {
    super(props);
    validateProps(props);

    const filters = props && !!props.filters ? props.filters : config.filters;

    this.averagePrice = null;
    this.filters = filters;
    this.length = 0;
    this.listings = [];
  }

  /**********************************************************************
   *
   * Product attribute getters
   *
   **********************************************************************/
  productTitles = async page => {
    // return array of product titles
    const res = await page.$$eval(config.selectors.titles, divs => {
      const data = [];
      divs.forEach(div => {
        // account for "new listing" <span> tag
        if (div.children.length > 0) {
          div.children[0].remove();
        }
        let str = div.textContent;
        str = str.replace('\n', '');
        str = str.replace(/\s+/g, ' ');

        data.push(str);
      });
      return data;
    });
    this.info(' -- scraped ' + res.length + ' titles');
    return res;
  };

  productPrices = async page => {
    // return array of product prices
    const res = await page.$$eval(config.selectors.prices, divs => {
      const data = [];
      divs.forEach(div => {
        let str = div.textContent;
        str = str.replace('\n', '');
        str = str.replace(/\s+/g, ' ');

        data.push(str);
      });
      return data;
    });
    this.info(' -- scraped ' + res.length + ' prices');
    return res;
  };

  productDates = async page => {
    // return array of product dates
    const res = await page.$$eval(config.selectors.dates, divs => {
      const data = [];
      divs.forEach(div => {
        let str = div.textContent;
        str = str.replace('\n', '');
        str = str.replace(/\s+/g, ' ');

        data.push(str);
      });
      return data;
    });
    this.info(' -- scraped ' + res.length + ' dates');
    return res;
  };

  productImages = async page => {
    // return array of product images
    const res = await page.$$eval(config.selectors.images, divs => {
      const data = [];
      divs.forEach(div => {
        data.push(div.src);
      });
      return data;
    });
    this.info(' -- scraped ' + res.length + ' images');
    return res;
  };

  productLinks = async page => {
    // return array of product links
    const res = await page.$$eval(config.selectors.links, divs => {
      const data = [];
      divs.forEach(div => {
        data.push(div.href);
      });
      return data;
    });
    this.info(' -- scraped ' + res.length + ' links');
    return res;
  };

  productInfo = async page => {
    // return array of product information
    const res = await page.$$eval(config.selectors.info, divs => {
      const data = [];
      divs.forEach(div => {
        let str = div.textContent;
        str = str.replace('\n', '');
        str = str.replace(/\s+/g, ' ');

        data.push(str);
      });
      return data;
    });
    this.info(' -- scraped ' + res.length + ' info tags');
    return res;
  };

  /**********************************************************************
   *
   * Scrape Ebay for productName attributes
   *
   **********************************************************************/

  scrapeFor = async productName => {
    // format the product name for the query url
    this.productName = productName.split(' ').join('+');

    // generate and store the site url, applying applicable filters
    const {appliedFilters, filterParams} = this.generateUrl(this.filters, config.filterDict);

    this.appliedFilters = appliedFilters;
    this.filterParams = filterParams;

    this.info(`--> scraping ${this.test ? this.testsPath : this.url}`);
    const res = await this.scrape();
    res.ebayUrl = this.url;
    res.filters = this.appliedFilters;
    res.averagePrice = this.calcAveragePrice(res.listings);
    this.info('--> finished scraping');
    return res;
  };

  createListingObj = ({idx, titles, prices, dates, images, links, info}) => {
    // create a listing obj with title, price, date, image, link, and tag info
    return {
      title: titles[idx],
      price: prices[idx],
      date: dates[idx],
      image: images[idx],
      link: links[idx],
      info: info[idx],
    };
  };

  /**********************************************************************
   *
   * Puppeteer logic
   *
   **********************************************************************/

  scrape = async () => {
    /**
     * returns =>
     * {
     *  products: Array,
     *  prices: Array,
     *  dates: Array,
     *  images: Array,
     *  links: Array,
     *  info: Array
     * };
     */
    const siteConfig = config[this.type];
    // setup puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();

    // load local html if running tests, otherwise request remote url
    if (this.test) {
      await page
        .goto(`file:${path.join(__dirname, this.testsPath)}`)
        .catch(err => console.warn(err));
      this.info('--> loaded local html file');
    } else {
      await page.goto(this.url);
      this.info('--> loaded remote site url');
    }

    // configure the browser
    const viewport = this.browserSettings.viewport;
    await page.setViewport(viewport);
    this.info('--> set the viewport to ' + viewport.width + 'x' + viewport.height);

    await navigationPromise;
    this.info('--> navigation promise loaded');

    // wait for at least 4 results to load
    await page
      .waitForSelector(config.selectors.waitSelector, this.browserSettings.timeout)
      .catch(err => {
        // if timed out, most likely no results found
        this.error(err.message);
      });
    this.info('--> waitSelector loaded');

    this.info('--> scraping for attributes...');
    // store references to the listing attributes
    const titles = await this.productTitles(page);
    const prices = await this.productPrices(page);
    const dates = await this.productDates(page);
    const images = await this.productImages(page);
    const links = await this.productLinks(page);
    const info = await this.productInfo(page);

    const listings = [];

    titles.forEach((product, idx) => {
      let args = {idx, titles, prices, dates, images, links, info};
      listings.push(this.createListingObj(args));
    });

    return {listings, titles, prices, dates, images, links, info};
  };
}

module.exports = {
  Ebay: Ebay,
};
