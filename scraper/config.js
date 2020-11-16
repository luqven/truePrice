const config = {
  ebay: {
    url: 'https://www.ebay.com/sch/i.html?_from=R40&_nkw=${productName}&_sacat=0&${filterParams}',
    testsPath: '../../tests/ebay.html',
    browserSettings: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      viewport: {width: 1792, height: 934},
      timeout: 15000,
    },
  },
};

module.exports = {
  config,
};
