# 0.1.3

> **Breaking changes**
- Changed `fetchAveragePrice()` to accept an `options` object parameter rather than individual params
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