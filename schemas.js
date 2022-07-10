const Joi = require('joi')

const schemas = {
  question: Joi.object().keys({
    author: Joi.string().required(),
    summary: Joi.string().required(),
    answers: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().required(),
        author: Joi.string().required(),
        summary: Joi.string().required()
      })
    )
  }),
  answer: Joi.object().keys({
    author: Joi.string().required(),
    summary: Joi.string().required()
  })
}

module.exports = schemas
