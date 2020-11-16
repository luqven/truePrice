# true-price

_v0.1.4_

A tool that scrapes Ebay for item listings and returns a list of matching items and their average
sale price (excluding outliers).

[See it in action 🔗](https://tprice-development.herokuapp.com/)

[![NPM](https://nodei.co/npm/package.png?mini=true)](https://npmjs.org/package/true-price)

## Dependencies

> Puppeteer, and therefore this package, requires access to the filesystem. It therefore cannot be
> used in the browser. More about this [here](https://github.com/puppeteer/puppeteer/pull/5750).

- Puppeteer
- Node.js
- Yarn
- Joi

#### Dev Dependencies
- Jest

## Use
inside your project directory run
```console
yarn add true-price
```

in your JS
```javascript
const {truePrice} = require('truePrice');

const options = {
  type: 'ebay',
  verbose: true,
};

const ebay = truePrice.init(options);
return ebay.scrapeFor('nintendo switch').then(res => console.log(res.listings));
```

- Returns a POJO with list of matching items and the average sold price for that item

### Sample result

```javascript
{
  listings: [
    {
      title: 'Nintendo Switch 32gb lite - NIB yellow',
      price: '$170.00',
      date: 'Nov-4 09:14',
      image: 'https://i.ebayimg.com/thumbs/images/g/gEkAAOS...5.webp',
      link: 'https://www.ebay.com/itm/Nintendo-Switch-32gb-lite-NIB-yellow/353262609618?hash=...b',
      info: 'Open Box · Nintendo Switch · Nintendo Switch Lite'
    },
    {
      title: 'Nintendo Switch Lite Pokemon Edition (Zacian and Zamazenta Edition) + more!',
      price: '$256.00',
      date: 'Nov-4 09:09',
      image: 'https://i.ebayimg.com/thumbs/images/g/E14....webp',
      link: 'https://www.ebay.com/itm/Nintendo-Switch-Lite-Pokemon-Edition-Z...',
      info: 'Pre-Owned · Nintendo Switch · Nintendo Switch Lite'
    },...
  ],
  titles: [
    'Nintendo Switch 32gb lite - NIB yellow',
    'Nintendo Switch Lite Pokemon Edition (Zacian and Zamazenta Edition) + more!',...
  ],
  prices: [
    '$170.00', '$256.00',...
  ],
  dates: [
    'Nov-4 09:14', 'Nov-4 09:09',...
  ],
  images: [
    'https://i.ebayimg.com/thumbs/images/....webp',
    'https://i.ebayimg.com/thumbs/images/g/h...bp',...
  ],
  links: [
    'https://www.ebay.com/itm/Gray-Nintendo-Switch-Lite-Bundle-Original...',
    'https://www.ebay.com/itm/...',...
  ],
  info: [
    'Open Box · Nintendo Switch · Nintendo Switch Lite',
    'Pre-Owned · Nintendo Switch · Nintendo Switch Lite', ...
  ],
  ebayUrl: 'https://www.ebay.com/sch/i.html?_from=R40&_nkw=nintendo+switch&...',
  filters: [ [ 'Show Only', 'Completed Items', 'Sold Items' ] ],
  averagePrice: 252.39857142857142
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
