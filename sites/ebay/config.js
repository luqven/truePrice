const filterDict = {
  // TODO: enable all filters
  showAll: {
    text: 'Show All',
    params: '',
  },
  showOnly: {
    text: 'Show Only',
    params: 'rt=nc&',
    freeReturns: {text: 'Free Returns', params: 'LH_FR=1'},
    returnsAccepted: {text: 'Returns Accepted', params: 'LH_RPA=1'},
    authorizedSeller: {text: 'Authorized Seller', params: 'LH_AS=1'},
    completed: {text: 'Completed Items', params: 'LH_Complete=1'},
    sold: {text: 'Sold Items', params: 'LH_Sold=1'},
    dealsAndSavings: {text: 'Deals & Savings', params: 'LH_Savings=1'},
    authenticityGuarantee: {text: 'Authenticity Guarantee', params: 'LH_AV=1'},
  },
};

const defaultFilters = {showOnly: {completed: true, sold: true}};

const selectors = {
  titles: '.s-item__title.s-item__title--has-tags',
  prices: '.s-item__price',
  dates: '.s-item__ended-date.s-item__endedDate',
  images: '.s-item__image-img',
  links: '.s-item__link',
  info: '.s-item__subtitle',
  waitSelector:
    '.srp-results > .s-item:nth-child(4) > .s-item__wrapper > .s-item__info > .s-item__details',
};

module.exports = {
  filterDict,
  filters: defaultFilters,
  selectors,
};
