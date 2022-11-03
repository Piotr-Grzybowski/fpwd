const Joi = require('joi')

const schemas = {
  question: Joi.object().keys({
    author: Joi.string().required().trim(),
    summary: Joi.string().required().trim(),
    answers: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().required(),
        author: Joi.string().required().trim(),
        summary: Joi.string().required().trim()
      })
    )
  }),
  answer: Joi.object().keys({
    author: Joi.string().required().trim(),
    summary: Joi.string().required().trim()
  })
}

module.exports = schemas
