const {
  makeQuestionRepository
} = require('../repositories/question.repository')

module.exports = fileName => (req, res, next) => {
  req.repositories = { questionRepo: makeQuestionRepository(fileName) }
  next()
}
