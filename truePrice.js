const path = require('path');
const puppeteer = require('puppeteer');
const { filterOutliers } = require('./helpers');

/**
 * 
 * @param {*} options   <Object> with productName, verbose, localHtml, and filter values
 *  productName         <String> placed into the ebay query url
 *  verbose             <Boolean> whether or not to log output to the console
 *  localHtml           <String> if present scrapes this html file instead of ebay url
 *  filters             <Object> indicating the types of filters to be applies to the SERP
 *  
 * returns: 
 * 
 * {
 *  listings: [
 *     { 
 *       html: <String>,
 *       image: <String>,
 *       title: <String>,
 *       link: <String>,
 *       price: <String>,
 *       date: <String> 
 *     }, ...
 *   ],
 *  averagePrice: <String>;
 * }
 * 
 */

 // POJO that stores url filter params
const filterDict = {
    // TODO: enable all filters
    showAll: {
        text: 'Show All',
        params: '',
    },
    showOnly: {
        text: 'Show Only',
        params: 'rt=nc&',
        freeReturns: { text: 'Free Returns', params: 'LH_FR=1' },
        returnsAccepted: { text: 'Returns Accepted', params: 'LH_RPA=1' },
        authorizedSeller: { text: 'Authorized Seller', params: 'LH_AS=1' },
        completed: { text: 'Completed Items', params: 'LH_Complete=1' },
        sold: { text: 'Sold Items', params: 'LH_Sold=1' },
        dealsAndSavings: { text: 'Deals & Savings', params: 'LH_Savings=1' },
        authenticityGuarantee: { text: 'Authenticity Guarantee', params: 'LH_AV=1' }
    }
}

const defaultFilters = { showOnly: { completed: true, sold: true} }

// given a product name, return it's average sold price
const fetchAveragePrice = ({productName, verbose, filters, localHtml}) => {

    // if no user set filters, use default
    if (!filters) { filters = defaultFilters; }

    return (async () => {
        // setup puppeteer
        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        productName = productName.split(' ').join('+')

        // ebay query url with filters for sold listings
        let filterParams = '';
        let appliedFilters = [];
        // parse the filter options
        Object.keys(filters).forEach(filter => {
            let appliedFilter = [filterDict[filter].text]
            let filterType = filterDict[filter];
            filterParams = filterParams + filterType.params
            let filterOptions = [];
            let options = filters[filter];

            Object.keys(options).forEach((option) => {
                appliedFilter.push(filterType[option].text)
                filterOptions.push(filterType[option].params)
            })

            filterOptions = filterOptions.join('&')
            filterParams = filterParams + filterOptions
            appliedFilters.push(appliedFilter)
        })
        // set the ebay url with the productName and the filterParams
        const ebayUrl =`https://www.ebay.com/sch/i.html?_from=R40&_nkw=${productName}&_sacat=0&${filterParams}`
        verbose && console.info('set remote ebay url to ' + ebayUrl)

        // load raw html if present
        if (localHtml) { 
            await page.goto(`file:${path.join(__dirname, 'tests/test.html')}`);
            verbose && console.info('loaded raw html file')
        } else {
        // else, browser to ebay
            await page.goto(ebayUrl)
            verbose && console.info('loaded remote ebay url')
        }

        await page.setViewport({ width: 1792, height: 934 })
        verbose && console.info('set the viewport to ' + 1792 + '|' + 934)
        
        await navigationPromise
        verbose && console.info('navigation promise loaded')
        
        // wait for at least 4 results to load
        await page.waitForSelector('.srp-results > .s-item:nth-child(4) > .s-item__wrapper > .s-item__info > .s-item__details', { timeout: 15000 })
        .catch((err) => {
            // if timed out, most likely no results found
            verbose && console.log(err.message)
        })
        verbose && console.info('SERP results loaded')
        
        // for each listing on the page, parse the html
        let productListings = await page.$$eval('.srp-results > .s-item', (listings) => {

            return listings.map((listing) => {
               
                const listingInfo = {
                    html: null,
                    image: null,
                    title: null,
                    link: null,
                    price: null,
                    date: null,
                };

                listingInfo.html = listing.innerHTML

                // return slice of html after start, before end strings
                const parseRange = (html, start, end) => {
                    let startIdx = html.indexOf(start) + start.length
                    let endIdx = html.slice(startIdx, html.length).indexOf(end) + startIdx
                    return html.slice(startIdx, endIdx)
                }

                // store the listing image, link, price, title, and date in the listingInfo object
                const data = ['image', 'link', 'price', 'title', 'date']
                const ranges = [
                    { start: 'src="', end: '"' },
                    { start: '"s-item__link" href="', end: '"' },
                    { start: '>$', end: '<' },
                    { start: 'alt=', end: 'src=' },
                    { start: 'endedDate">', end: '<' }
                ]

                data.forEach((key, idx) => {
                    let range = ranges[idx]
                    listingInfo[key] = parseRange(listingInfo.html, range.start, range.end)
                })

                return listingInfo
            })
        });
        
        let prices = productListings.map((listing) => {
            let price = listing.price
            let sanitizedPrice = price.replace('$', ''); // remove the dollar sign
            let match = sanitizedPrice.match(/[0-9,.]*/); // find collection of numbers, ie separate fromm possible text

            if (match !== null) {
                let amount = parseFloat(match[0].replace(/,/g, '')); // replace ',' K separator
                return amount;
            }
        })
        verbose && console.info('prices ', prices)
        
        // filter out the outliers
        const { outliers, filteredValues } = filterOutliers(prices);
        verbose && console.info('filtered outliers ', outliers)
        verbose && console.info('filtered prices ', prices)
        

        // calculate to sum of all prices
        let priceSum = null;
        if (prices.length > 1) {
            priceSum = prices.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            })
        }
        verbose && console.info('price sum ', priceSum)
        

        // calculate the average price
        let averagePrice = 'n/a'
        if (!!priceSum) {
            averagePrice = priceSum / prices.length;
        }
        verbose && console.info('average price ', averagePrice)
        
        // TODO: store the max-min dateRange (ie 5 days)
            // find the average of those 5 prices
            // compare to last seen price and store result as price trend

            // output `${item} was at ${lastSeenPrice}, is trending ${priceTrend}, over the last ${dateRange}`
        
        return { 
            listings: productListings,
            length: productListings.length,
            averagePrice,
            filters: appliedFilters,
            ebayUrl,
        };
    })();
};

const truePrice = {
    fetchAveragePrice: fetchAveragePrice
}

module.exports = {
    truePrice: truePrice
}