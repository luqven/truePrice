# true-price

_v0.1.3_

A tool that scrapes Ebay for item listings and returns a list of matching items and their average sale price (excluding outliers).

[See it in action 🔗](https://tprice-development.herokuapp.com/)


## Dependencies

> Puppeteer, and therefore this package, requires access to filesystem calls. It therefore cannot be used in the browser. More [here](https://github.com/puppeteer/puppeteer/pull/5750).

- Puppeteer
- Node.js
- Yarn

## Use

- Fill out an options object with the name of the item you want to buy, wether or not to log, and any filtering options

``` javascript

const options = {
    productName: 'nintendo switch', // the name of the item to search for
    verbose: true, // whether or not to log progress and info
    filters: { showOnly: { completed: true, sold: true, freeReturns: true } }, // filtering options
    localHtml: null // relative url to the local html to scrape instead
}
```

- Call `truePrice.fetchAveragePrice()` with your `options` defined

```javascript

const { truePrice } = require('truePrice') 

const options = {
    productName: 'nintendo switch',
    verbose: true, 
    filters: { showOnly: { completed: true, sold: true, freeReturns: true } },
    localHtml: null 
}

truePrice.fetchAveragePrice(options).then((res) => console.log(res));

```

- Returns a POJO with list of matching items and the average sold price for that item

### Sample result

``` javascript
{
  [
    {
      html: '<div class="s-item__wrapper clearfix"><div class="s-item__image-section"><div class="s-item__image"><a tabindex="-1" aria-hidden="true" data-track=...',
      image: 'https://i.ebayimg.com/thumbs/images/g/cPwAAOSwnUhfpdLC/s-l225.webp',
      title: '"Nintendo Switch HAC-001(-01) 32GB Console with Gray Joy‑Con" ',
      link: 'https://www.ebay.com/itm/Nintendo-Switch-HAC-001-01-32GB-Console-with-Gray-Joy-Con/333780426959?epid=25034355190&amp;hash=item4db6dd20cf:g:cPwAAOSwnUhfpdLC',
      price: '199.99',
      date: 'Nov-6 21:35'
    },
    {
      html: '<div class="s-item__wrapper clearfix"><div class="s-item__image-section"><div class="s-item__image"><a tabindex="-1" aria-hidden="true" data-track="{&quot;eventFamily&quot;:&quot;LST&quot;,&quot;eventAction&quot;:&quot;ACTN&quot;,&quot;actionKind&quot;:&quot;NAVSRC&quot;,&quot;actionKinds&quot;...<span class="s-item__sell-one-like-this s-item__sellLikeThisInfo"><a _sp="p2351460.m4114.l8375" href="http://cgi5.ebay.com/ws/eBayISAPI.dll?SellLikeItem&amp;item=154178357222&amp;ssPageName=STRK:MEWN:LILTX">Sell one like this</a></span></div></div></div></div>',
      image: 'https://i.ebayimg.com/thumbs/images/g/1IYAAOSwc~Nfo3-D/s-l225.webp',
      title: '"Nintendo switch lite Yellow Console with GRIP case can add game if i still have" ',
      link: 'https://www.ebay.com/itm/Nintendo-switch-lite-Yellow-Console-with-GRIP-case-can-add-game-if-i-still-have/154178357222?epid=19034590465&amp;hash=item23e5bf07e6:g:1IYAAOSwc~Nfo3-D',
      price: '155.00',
      date: 'Nov-6 21:05'
    }
  ],
  length: 50,
  averagePrice: 263.9741999999999,
  filters: [
    [ 'Show Only', 'Completed Items', 'Sold Items', 'Deals & Savings' ]
  ],
  ebayUrl: 'https://www.ebay.com/sch/i.html?_from=R40&_nkw=nintendo+switch&_sacat=0&rt=nc&LH_Complete=1&LH_Sold=1&LH_Savings=1'
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
- [ ] Browser support