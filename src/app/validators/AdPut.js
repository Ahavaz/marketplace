const Joi = require('joi')

module.exports = {
  body: {
    title: Joi.string(),
    description: Joi.string(),
    price: Joi.number()
  }
}
