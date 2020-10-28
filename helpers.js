
/**
 * 
 * @param {*} pricesArray , Array of Floats representing item listing prices
 * 
 * Removes prices which fall more than 1.5 times the interquartile range above the third quartile or below the first quartile.
 * Returns an object with the filteredValues and the outliers
 * 
 * based off of answer to: https://stackoverflow.com/questions/20811131/javascript-remove-outlier-from-an-array
 * 
 */

function filterOutliers(pricesArray) {

    // Copy the values, rather than operating on references to existing values
    var values = pricesArray.concat();

    // Then sort
    values.sort(function (a, b) {
        return a - b;
    });

    /* Then find a generous IQR. This is generous because if (values.length / 4) 
     * is not an int, then really you should average the two elements on either 
     * side to find q1.
     */
    let q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3. 
    let q3 = values[Math.ceil((values.length * (3 / 4)))];
    let iqr = q3 - q1;

    // Then find min and max values
    let maxValue = q3 + iqr * 1.5;
    let minValue = q1 - iqr * 1.5;

    // keep track of the removed outliers
    let outliers = [];

    // Then filter anything beyond or beneath these values.
    let filteredValues = values.filter(function (x) {
        if ((x <= maxValue) && (x >= minValue)) return;
        else outliers.push(x)
    });

    return {filteredValues, outliers};
};

/**
 * 
 * @param {*} price , String, dollar amount a item listing sold for
 * 
 * Converts dollars to Floats
 * 
 */

// const normalizePrice = (price) => { return parseFloat(price.split('$')[1].split(',').join('')) }


 const convertCurrency = (price) => {
     let sanitizedPrice = price.replace('$', ''); // remove the dollar sign
     let match = sanitizedPrice.match(/[0-9,.]*/); // find collection of numbers, ie separate fromm possible text

     if (match !== null) {
         let amount = parseFloat(match[0].replace(/,/g, '')); // replace ',' K separator
         return amount;
     }

     return null; // no matching price text found
 };


module.exports = {
    convertCurrency: convertCurrency,
    filterOutliers: filterOutliers
};
