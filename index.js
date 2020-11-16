const {truePrice} = require('./truePrice');

// const filters = { showOnly: { completed: true, sold: true, dealsAndSavings: true }}
// const options = {
//     productName: 'nintendo switch',
//     verbose: true,
//     filters: filters,
// }
//
// truePrice.fetchAveragePrice(options).then((res) => console.log(res));

module.exports = {
  truePrice: truePrice,
};
