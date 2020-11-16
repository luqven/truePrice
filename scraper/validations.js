const Joi = require('joi');

const schema = Joi.object({
  type: Joi.any().valid('ebay'), // TODO: fix type validation
  test: Joi.bool(), // load local html file for tests scraping
  verbose: Joi.bool(), // logging
  url: Joi.string().domain(), // i.e., www.ebay.com/search/?
  browserSettings: Joi.object({
    // puppeteer browser settings
    args: Joi.array().items(
      Joi.string().required().valid('--no-sandbox'),
      Joi.string().required().valid('--disable-setuid-sandbox')
    ),
    viewport: Joi.object({
      width: Joi.number(),
      height: Joi.number(),
    }),
    timeout: Joi.number(),
  }),
});

const validateProps = props => {
  schema.validate(props);
};

module.exports = {
  validateProps: props => validateProps(props),
};
