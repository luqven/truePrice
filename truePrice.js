const { filter } = require('minimatch');
const puppeteer = require('puppeteer');
const { filterOutliers } = require('./helpers');

/**
 * 
 * @param {*} productName , String placed into the ebay query url
 * @param {*} verbose , whether or not to log output to the console
 * 
 */

// given a product name, return it's average sold price
const fetchAveragePrice = (productName, verbose) => {
    return (async () => {
        // setup puppeteer
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()

        // browser to ebay
        productName = productName.split(' ').join('+')
        // ebay query url with filters for sold listings
        const ebayUrl = `https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=${productName}&_sacat=0&LH_TitleDesc=0&_sop=1&LH_Auction=1&_osacat=0&_odkw=${productName}&rt=nc&LH_Sold=1`

        await page.goto(ebayUrl)
        await page.setViewport({ width: 1792, height: 934 })
        await navigationPromise

        // TODO
            // pull out the first 3 titles
            // store the ebay title as an entry for the user input title
            // store the url of the selected option
            // store the sold price of the item
            // store the end date of the item

            // if no previous entry matching that title
            // store that price as last seen price

        // wait for at least 4 results to load
        await page.waitForSelector('.srp-results > .s-item:nth-child(4) > .s-item__wrapper > .s-item__info > .s-item__details')
        
        // TODO: store the number of results found
            // let listings = await page.$$eval('.s-item__detail').length
        
        // store the prices for each listing
        let prices = await page.$$eval('.s-item__price', details => {
            return details.map(detail => {
                // convert currency price text to float
                let price = detail.textContent;
                let sanitizedPrice = price.replace('$', ''); // remove the dollar sign
                let match = sanitizedPrice.match(/[0-9,.]*/); // find collection of numbers, ie separate fromm possible text

                if (match !== null) {
                    let amount = parseFloat(match[0].replace(/,/g, '')); // replace ',' K separator
                    return amount;
                }
            });
        });
        verbose && console.log('prices ', prices)
        
        // filter out the outliers
        const { outliers, filteredValues } = filterOutliers(prices);
        verbose && console.log('filtered outliers ', outliers)
        verbose && console.log('filtered prices ', prices)
        
        // calculate to sum of all prices
        let priceSum = prices.reduce((accumulator, currentValue) => {
            verbose && console.log('accumulator, '+ accumulator + ', currentValue, ' + currentValue)
            return accumulator + currentValue;
        });
        verbose && console.log('price sum ', priceSum)
        
        // calculate the average price
        let averagePrice = priceSum / prices.length;
        verbose && console.log('average price ', averagePrice)
        
        // TODO: store the max-min dateRange (ie 5 days)
            // find the average of those 5 prices
            // compare to last seen price and store result as price trend

            // output `${item} was at ${lastSeenPrice}, is trending ${priceTrend}, over the last ${dateRange}`
        
        return averagePrice;
    })();
};

const truePrice = {
    fetchAveragePrice: fetchAveragePrice
}

module.exports = {
    truePrice: truePrice
}