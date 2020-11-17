# 0.1.5
- Fixed bug where `calcAveragePrice()` returned 'n/a' when less than 4 prices found

# 0.1.4

> **Breaking changes**

- Added a deprecation warning for `fetchAveragePrice()`, replaced by new `Ebay` class
- Created a `Scraper` class that now handles most of the generic scraping logic and run-time configuration
- Created an `Ebay` class that now handles most of the ebay-specific scraping logic

  - New usage looks like

  ```javascript
const {truePrice} = require('../truePrice');

  const options = {
    type: 'ebay',
    verbose: true,
  };

  const ebay = truePrice.init(options);
  return ebay.scrapeFor('nintendo switch').then(res => console.log(res.listings));
  ```

- Utilized `Ebay` class method `scrapeFor(<String>)` in module
- Added very basic options object validations to both Scraper and Ebay classes
- Updated test to reflect the above changes

# 0.1.3

> **Breaking changes**

- Changed `fetchAveragePrice()` to accept an `options` object parameter rather than individual
  params
- Added filtering for the SERP
  - Available filters (set to `true` in options object to use):
    - `showAll`: search all of ebay, not just sold and completed listings
    - `showOnly`: only show search results that include
      - `freeReturns`
      - `returnsAccepted`
      - `authorizedSeller`
      - `completed`
      - `sold`
      - `dealsAndSavings`
      - `authenticityGuarantee`
