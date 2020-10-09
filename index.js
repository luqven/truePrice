  const puppeteer = require('puppeteer');

  // helpers
  const getSum = (accumulator, currentValue) => {
    console.log(currentValue)
    return accumulator + currentValue;
  };

  // ask for product name input
  let productName;
  // Get process.stdin as the standard input object.
  let standard_input = process.stdin;

  // Set input character encoding.
  standard_input.setEncoding('utf-8');

  // Prompt user to input data in console.
  console.log("Please input item name in command line.");

  // When user input data and click enter key.
  standard_input.on('data', function (data) {

    // User input exit.
    if (data === 'exit\n') {
      // Program exit.
      console.info("Quitting tPrice");
      process.exit();``
    } else {
      data = data.toString().trim();
      productName = data;

      // search ebay for said product

      (async () => {
        // setup puppeteer
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()

        // browser to ebay
        productName = productName.split(' ').join('+')
        const ebayUrl = `https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=${productName}&_sacat=0&LH_TitleDesc=0&_sop=1&LH_Auction=1&_osacat=0&_odkw=${productName}&rt=nc&LH_Sold=1`
        await page.goto(ebayUrl)
        await page.setViewport({ width: 1792, height: 934 })
        await navigationPromise

        // pull out the first 3 titles
        // store the ebay title as an entry for the user input title
        // store the url of the selected option
        // store the sold price of the item
        // store the end date of the item

        // if no previous entry matching that title
        // store that price as last seen price

        // wait for at least 4 results to load
        await page.waitForSelector('.srp-results > .s-item:nth-child(4) > .s-item__wrapper > .s-item__info > .s-item__details')
        // store the number of results found
        // let listings = await page.$$eval('.s-item__detail').length
        // store the prices for each listing, then remove outliers
        let prices = await page.$$eval('.s-item__price', details => details.map(detail => {
          return detail.textContent
        }))
        console.log(prices)
        const normalizePrice = (price) => { return parseFloat(price.split('$')[1].split(',').join('')) }
        prices.forEach((price, idx) => prices[idx] = normalizePrice(price))
        console.log(prices)
        // track the average price so far
        let averagePrice = prices[0]
        console.log(averagePrice)
        // if +/- 20% of the average price, listing is considered outlier
        let upperBound = averagePrice + averagePrice * .20
        let lowerBound = averagePrice - averagePrice * .20
        // filter the prices to match bounds
        prices.filter(price => price < upperBound && price > lowerBound)
        averagePrice = prices.reduce(getSum) / prices.length;
        // find the average price
        console.log('Average price: ' + averagePrice)
        // store the max-min dateRange (ie 5 days)

        // find the average of those 5 prices
        // compare to last seen price and store result as price trend

        // output `${item} was at ${lastSeenPrice}, is trending ${priceTrend}, over the last ${dateRange}`

      })();


    }
  });
