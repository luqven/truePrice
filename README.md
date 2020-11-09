# true-price

An tool that scrapes the Ebay sold listings page for the latest items that match your query, returns list of matching sold items and their average sale price (excluding outliers).

> Because this tool has Puppeteer as a dependency, it is not intended to be used inside a webapp.

## Dependencies

- Puppeteer
- Node.js
- Yarn

## Use


- Enter the name of the item you want to buy
- Returns a POJO with list of matching items and the average sold price for that item


```javascript

const { truePrice } = require('truePrice') 

truePrice.fetchAveragePrice('nintendo switch', true).then((res) => console.log(res));
```

``` javascript
//   function fetchAveragePrice(productName, verbose, localHtml){}
//   @param {*} productName , String placed into the ebay query url
//   @param {*} verbose , whether or not to log output to the console
//   @param {*} localHtml , if present scrapes this html file instead of ebay url
//   returns:
  
  {
   listings: [
      { 
        html: <String>,
        image: <String>,
        title: <String>,
        link: <String>,
        price: <String>,
        date: <String> 
      }, ...
    ],
   averagePrice: <String>
  }
```

## Roadmap

- [x] Scrape sold SERP for item price, title, images, and sold dates
- [x] Find the average price found for that item on the sold SERP
- [ ] Scrape x amount of listings
- [ ] Filter by price range
- [ ] Filter by date range
- [ ] Filter by category
- [ ] Filter by shipping price
- [ ] Filter by condition
- [ ] Filter by seller