const { Console } = require('console');
const fs = require('fs');
const { truePrice } = require('../truePrice')

const verbose = false;
const localHtml = true
const data = {};

describe('truePrice module', () => {

    test('returns the correct average price', () => {
        return truePrice.fetchAveragePrice('nintendo switch', verbose, localHtml).then((res) => {
            expect(res.averagePrice).toBe(266.97059999999993)
        })
    });

    test('returns the correct number of listings', () => {
        return truePrice.fetchAveragePrice('nintendo switch', verbose, localHtml).then((res) => {
            expect(Object.keys(res.listings).length).toBe(50)
        })
    });

    // TODO: add tests for listing type

    describe('listings object', () => {

        test('returns the listings img src', () => {
            return truePrice.fetchAveragePrice('nintendo switch', verbose, localHtml).then((res) => {
                const listingHaveImages = (listings) => {
                    let res = true;
                    listings.forEach((listing) => {
                        if (!listing.image.includes('https://i.ebayimg.com') ) {
                            res = false
                        }
                    })
                    return res;
                }
                expect(listingHaveImages(res.listings)).toBe(true)
            })
        })

        test('returns the links to the original listings', () => {
            return truePrice.fetchAveragePrice('nintendo switch', verbose, localHtml).then((res) => {
                const listingsHaveLinks = (listings) => {
                    let res = true;
                    listings.forEach((listing) => {
                        if (!listing.link.includes('https://www.ebay.com/itm')) {
                            res = false
                        }
                    })
                    return res;
                }
                expect(listingsHaveLinks(res.listings)).toBe(true)
            })
        })

        test('returns the title of the original listings', () => {
            return truePrice.fetchAveragePrice('nintendo switch', verbose, localHtml).then((res) => {
                const listingsHaveTitles = (listings) => {
                    let res = true;
                    listings.forEach((listing) => {
                        if (!listing.title) {
                            res = false
                        }
                    })
                    return res;
                }
                expect(listingsHaveTitles(res.listings)).toBe(true)
            })
        })

        test('returns the listings end date', () => {
            return truePrice.fetchAveragePrice('nintendo switch', verbose, localHtml).then((res) => {
                const listingsHaveDates = (listings) => {
                    let res = true;
                    listings.forEach((listing) => {
                        if (!listing.date.includes('-') && !(listing.date.includes(':'))) {
                            res = false
                        }
                    })
                    return res;
                }
                expect(listingsHaveDates(res.listings)).toBe(true)
            })
        })
    })

})