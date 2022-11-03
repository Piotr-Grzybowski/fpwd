const router = require('express').Router()
const validator = require('../middleware/validator.middleware')
const schemas = require('../validatorSchemas/schemas')

router.get('/', async (req, res, next) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  } catch (error) {
    next(error)
  }
})

router.get('/:questionId', async (req, res, next) => {
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      req.params.questionId
    )
    res.json(question)
  } catch (error) {
    next(error)
  }
})

router.post('/', validator(schemas.question), async (req, res, next) => {
  try {
    const question = await req.repositories.questionRepo.addQuestion(req.body)
    res.json(question)
  } catch (error) {
    next(error)
  }
})

router.put(
  '/:questionId',
  validator(schemas.question),
  async (req, res, next) => {
    try {
      const question = await req.repositories.questionRepo.updateQuestion(
        req.body,
        req.params.questionId
      )
      res.json(question)
    } catch (error) {
      next(error)
    }
  }
)

router.delete('/:questionId', async (req, res, next) => {
  try {
    const question = await req.repositories.questionRepo.deleteQuestion(
      req.params.questionId
    )
    res.json(question)
  } catch (error) {
    next(error)
  }
})

router.get('/:questionId/answers', async (req, res, next) => {
  try {
    const answers = await req.repositories.questionRepo.getAnswers(
      req.params.questionId
    )
    res.json(answers)
  } catch (error) {
    next(error)
  }
})

router.post(
  '/:questionId/answers',
  validator(schemas.answer),
  async (req, res, next) => {
    try {
      const question = await req.repositories.questionRepo.addAnswer(
        req.params.questionId,
        req.body
      )
      res.json(question)
    } catch (error) {
      next(error)
    }
  }
)

router.get('/:questionId/answers/:answerId', async (req, res, next) => {
  try {
    const answer = await req.repositories.questionRepo.getAnswer(
      req.params.questionId,
      req.params.answerId
    )
    res.json(answer)
  } catch (error) {
    next(error)
  }
})

router.put(
  '/:questionId/answers/:answerId',
  validator(schemas.answer),
  async (req, res, next) => {
    try {
      const answer = await req.repositories.questionRepo.updateAnswer(
        req.params.questionId,
        req.params.answerId,
        req.body
      )

      res.json(answer)
    } catch (error) {
      next(error)
    }
  }
)

router.delete('/:questionId/answers/:answerId', async (req, res, next) => {
  try {
    const answer = await req.repositories.questionRepo.deleteAnswer(
      req.params.questionId,
      req.params.answerId
    )

    res.json(answer)
  } catch (error) {
    next(error)
  }
})

module.exports = router
