const {Ebay} = require('./sites/ebay/index');

const truePrice = {
  init: options => {
    return new Ebay(options);
  },
  fetchAveragePrice: options => {
    console.warn('WARNING: fetchAveragePrice will be deprecated in the next release');
    const ebay = new Ebay(options);
    return ebay.scrapeFor(options.productName);
  },
};

module.exports = {
  truePrice: truePrice,
};
