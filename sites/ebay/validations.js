const Joi = require('joi');

const schema = Joi.object({
  product: Joi.string()
    .pattern(/^[A-Za-z\s]+\s*/)
    .required(), // Aa-Zz with whitespace only
  filters: Joi.object({
    // i.e., { showOnly: { freeReturns: true } }
    showOnly: Joi.object({
      freeReturns: Joi.bool(),
      returnsAccepted: Joi.bool(),
      authorizedSeller: Joi.bool(),
      completed: Joi.bool(),
      sold: Joi.bool(),
      dealsAndSavings: Joi.bool(),
      authenticityGuarantee: Joi.bool(),
    }),
  }),
});

const validateProps = props => {
  schema.validate(props);
};

module.exports = {
  validateProps: validateProps,
};
