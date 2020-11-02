const puppeteer = require('puppeteer');
const { filterOutliers } = require('./helpers');

/**
 * 
 * @param {*} productName , String placed into the ebay query url
 * @param {*} verbose , whether or not to log output to the console
 * 
 * returns:
 * 
 * listingInfo = {
 *  html: <String>,
 *  image: <String>,
 *  title: <String>,
 *  link: <String>,
 *  price: <String>,
 *  date: <String>,
 * };
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
        const ebayUrl = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${productName}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1`

        await page.goto(ebayUrl)
        await page.setViewport({ width: 1792, height: 934 })
        await navigationPromise

        // wait for at least 4 results to load
        await page.waitForSelector('.srp-results > .s-item:nth-child(4) > .s-item__wrapper > .s-item__info > .s-item__details')

        // for each listing on the page
        let productListings = await page.$$eval('.srp-results > .s-item', (listings) => {
            // TODO: move logic to own function 
            // return listings.map( (listing) => parseListing(listing));
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
                // store the listing image url
                let imageString = '<img'
                let imageStart = listingInfo.html.indexOf('<img')
                let imageEnd = listingInfo.html.slice(listingInfo.html.indexOf('<img'), listingInfo.html.length).indexOf('count++; ">') + imageStart
                listingInfo.image = listingInfo.html.slice(imageStart, imageEnd) + '" </img>'

                // store the listing title
                let titleString = 'title--has-tags">'
                let titleStart = listingInfo.html.indexOf(titleString) + titleString.length
                let titleEnd = listingInfo.html.slice(titleStart, listingInfo.html.length).indexOf('</h3') + titleStart
                let titleText = listingInfo.html.slice(titleStart, titleEnd).replace('<span class="LIGHT_HIGHLIGHT">New Listing</span>', '')
                titleText = titleText.replace('<span class="BOLD">', '')
                listingInfo.title = titleText

                // store the listing url
                let linkString = '"s-item__link" href="'
                let linkStart =listingInfo.html.indexOf(linkString) + linkString.length
                let linkEnd = listingInfo.html.slice(linkStart, listingInfo.html.length).indexOf('<h') + linkStart - 2
                listingInfo.link = listingInfo.html.slice(linkStart, linkEnd)
                
                // store the listing sold price, IE <span class="POSITIVE">$12.99</span>
                let priceString = '>$'
                let priceStart = listingInfo.html.indexOf(priceString) + 1
                let priceEnd = listingInfo.html.slice(priceStart, listingInfo.html.length).indexOf('</') + priceStart
                listingInfo.price = listingInfo.html.slice(priceStart, priceEnd)
                
                // store the end date of the listing
                let dateString = 'endedDate">'
                let dateStart = listingInfo.html.indexOf(dateString) + dateString.length
                let dateEnd = listingInfo.html.slice(dateStart, listingInfo.html.length).indexOf('</') + dateStart
                listingInfo.date = listingInfo.html.slice(dateStart, dateEnd)
                return listingInfo
            })
        });

        verbose && console.log(productListings.forEach((listing) => console.log(listing.title, listing.price)))

        
        let prices = productListings.map((listing) => {
            let price = listing.price
            let sanitizedPrice = price.replace('$', ''); // remove the dollar sign
            let match = sanitizedPrice.match(/[0-9,.]*/); // find collection of numbers, ie separate fromm possible text

            if (match !== null) {
                let amount = parseFloat(match[0].replace(/,/g, '')); // replace ',' K separator
                return amount;
            }
        })

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