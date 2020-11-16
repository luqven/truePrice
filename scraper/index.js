const {config} = require('./config');
const {validateProps} = require('./validations');

class Scraper {
  constructor(props) {
    validateProps(props);

    this.type = props.type;

    const applyConfig = (config, props) => {
      this.browserSettings = props.browserSettings ? props.browserSettings : config.browserSettings;
      this.test = props.test ? props.test : false;
      this.testsPath = config.testsPath;
      this.url = props.url ? props.url : config.url;
      this.verbose = props.verbose ? props.verbose : false;
    };

    applyConfig(config[props.type], props);
  }

  /**********************************************************************
   *
   * Logging helpers
   *
   **********************************************************************/

  log(message) {
    this.verbose && console.log(message);
  }

  info(message) {
    this.verbose && console.info(message);
  }

  error(message) {
    this.verbose && console.info(message);
  }

  /**********************************************************************
   *
   * Formatting helpers
   *
   **********************************************************************/

  parseFilters = (filters, filterDict) => {
    let filterParams = '';
    let appliedFilters = [];

    // parse the filter options
    Object.keys(filters).forEach(filter => {
      let appliedFilter = [filterDict[filter].text];
      let filterType = filterDict[filter];

      filterParams = filterParams + filterType.params;

      let filterOptions = [];
      let options = filters[filter];

      Object.keys(options).forEach(option => {
        appliedFilter.push(filterType[option].text);
        filterOptions.push(filterType[option].params);
      });

      filterOptions = filterOptions.join('&');
      filterParams = filterParams + filterOptions;
      appliedFilters.push(appliedFilter);
    });

    // returned the filters applied and the resulting query params string
    return {applied: appliedFilters, params: filterParams};
  };

  generateUrl = (filters, filterDict) => {
    // replace the placeholder url params with attributes
    const {applied, params} = this.parseFilters(filters, filterDict);
    let url = this.url.replace('${productName}', this.productName);
    url = url.replace('${filterParams}', params);
    this.url = url;

    return {appliedFilters: applied, filterParams: params};
  };

  scrapePrices = listings => {
    // return array of formatted price strings
    return listings.map(listing => {
      let price = listing.price;
      let sanitizedPrice = price.replace('$', ''); // remove the dollar sign
      let match = sanitizedPrice.match(/[0-9,.]*/); // remove possible text values

      if (match !== null) {
        let amount = parseFloat(match[0].replace(/,/g, '')); // replace ',' K separator
        return amount;
      }
    });
  };

  priceSum = prices => {
    // return sum of prices array
    let priceSum = null;
    if (prices.length > 0) {
      priceSum = prices.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
    }

    this.info('--> price sum = ' + priceSum);

    return priceSum;
  };

  filterOutliers(pricesArray) {
    //  returns POJO of { [filteredPrices], [outliers] }

    // Copy the values & avoid operating on references
    let values = pricesArray.concat();

    // Sort
    values.sort(function (a, b) {
      return a - b;
    });

    /* Then find a generous IQR. This is 'generous' because if (values.length / 4)
     * is not an int, then really you should average the two elements on either
     * side to find q1.
     */
    const q1 = values[Math.floor(values.length / 4)];
    // Likewise for q3.
    const q3 = values[Math.ceil(values.length * (3 / 4))];
    const iqr = q3 - q1;

    // Then find min and max values
    const maxValue = q3 + iqr * 1.5;
    const minValue = q1 - iqr * 1.5;

    // keep track of the removed outliers
    const outliers = [];

    // Then filter anything beyond or beneath these values.
    let filteredPrices = values.filter(x => {
      if (x <= maxValue && x >= minValue) return x;
      else outliers.push('$' + x);
    });

    this.info('--> removed price outliers: ' + outliers);

    return {filteredPrices, outliers};
  }

  calcAveragePrice = listings => {
    // returns average price Float
    const prices = this.scrapePrices(listings);
    const {filteredPrices, outliers} = this.filterOutliers(prices);
    const sum = this.priceSum(filteredPrices);

    let averagePrice = 'n/a';
    if (!!sum) {
      averagePrice = sum / filteredPrices.length;
    }

    this.info('--> average price = ' + averagePrice);

    return averagePrice;
  };
}

module.exports = {
  Scraper,
};
