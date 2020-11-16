const fs = require('fs');
const {truePrice} = require('../truePrice');

const options = {
  type: 'ebay',
  test: true,
};

const ebay = truePrice.init(options);

describe('truePrice module', () => {
  test('returns the correct average price', () => {
    return ebay.scrapeFor('nintendo switch').then(res => {
      expect(res.averagePrice).toBe(252.39857142857142);
    });
  });

  test('returns the correct number of listings', () => {
    return ebay.scrapeFor('nintendo switch').then(res => {
      expect(Object.keys(res.listings).length).toBe(50);
    });
  });

  describe('listings object', () => {
    test('returns the listings img src', () => {
      return ebay.scrapeFor('nintendo switch').then(res => {
        const listingHaveImages = listings => {
          let res = true;
          listings.forEach(listing => {
            if (!listing.image.includes('https://i.ebayimg.com')) {
              res = false;
            }
          });
          return res;
        };
        expect(listingHaveImages(res.listings)).toBe(true);
      });
    });

    test('returns the links to the original listings', () => {
      return ebay.scrapeFor('nintendo switch').then(res => {
        const listingsHaveLinks = listings => {
          let res = true;
          listings.forEach(listing => {
            if (!listing.link.includes('https://www.ebay.com/itm')) {
              res = false;
            }
          });
          return res;
        };
        expect(listingsHaveLinks(res.listings)).toBe(true);
      });
    });

    test('returns the title of the original listings', () => {
      return ebay.scrapeFor('nintendo switch').then(res => {
        const listingsHaveTitles = listings => {
          let res = true;
          listings.forEach(listing => {
            if (!listing.title) {
              res = false;
            }
          });
          return res;
        };
        expect(listingsHaveTitles(res.listings)).toBe(true);
      });
    });

    test('returns the listings end date', () => {
      return ebay.scrapeFor('nintendo switch').then(res => {
        const listingsHaveDates = listings => {
          let res = true;
          listings.forEach(listing => {
            if (!listing.date.includes('-') && !listing.date.includes(':')) {
              res = false;
            }
          });
          return res;
        };
        expect(listingsHaveDates(res.listings)).toBe(true);
      });
    });
  });

  describe('filters', () => {
    // Filters tests
    describe('when no filters are given', () => {
      test('applies default filters to the url params', () => {
        return ebay.scrapeFor('nintendo switch').then(res => {
          expect(res.ebayUrl.includes('LH_Complete=1') && res.ebayUrl.includes('LH_Sold=1')).toBe(
            true
          );
        });
      });
      test('lists the applied filters correctly', () => {
        return ebay.scrapeFor('nintendo switch').then(res => {
          expect(res.filters[0] + '').toBe('Show Only,Completed Items,Sold Items');
        });
      });
    });

    describe('when filtering by free returns', () => {
      // re-initialize Ebay with new options
      options.filters = {showOnly: {completed: true, sold: true, freeReturns: true}};
      let filteredEbay = truePrice.init(options);

      test('applies the filter to the url', () => {
        return filteredEbay.scrapeFor('nintendo switch').then(res => {
          expect(res.ebayUrl.includes('LH_FR=1')).toBe(true);
        });
      });

      test('lists the applied filters correctly', () => {
        return filteredEbay.scrapeFor('nintendo switch').then(res => {
          expect(res.filters[0] + '').toBe('Show Only,Completed Items,Sold Items,Free Returns');
        });
      });
    });
  });
});
