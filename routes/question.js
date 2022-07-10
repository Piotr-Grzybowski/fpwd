const router = require('express').Router()
const validator = require('../middleware/validator')
const schemas = require('../schemas')

router.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

router.get('/questions', async (req, res, next) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  } catch (error) {
    next(error)
  }
})

router.get('/questions/:questionId', async (req, res, next) => {
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      req.params.questionId
    )
    res.json(question)
  } catch (error) {
    next(error)
  }
})

router.post(
  '/questions',
  validator(schemas.question),
  async (req, res, next) => {
    try {
      const question = await req.repositories.questionRepo.addQuestion(req.body)
      res.json(question)
    } catch (error) {
      next(error)
    }
  }
)

router.put(
  '/questions/:questionId',
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

router.delete('/questions/:questionId', async (req, res, next) => {
  try {
    const question = await req.repositories.questionRepo.deleteQuestion(
      req.params.questionId
    )
    res.json(question)
  } catch (error) {
    next(error)
  }
})

router.get('/questions/:questionId/answers', async (req, res, next) => {
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
  '/questions/:questionId/answers',
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

router.get(
  '/questions/:questionId/answers/:answerId',
  async (req, res, next) => {
    try {
      const answer = await req.repositories.questionRepo.getAnswer(
        req.params.questionId,
        req.params.answerId
      )
      res.json(answer)
    } catch (error) {
      next(error)
    }
  }
)

router.put(
  '/questions/:questionId/answers/:answerId',
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

router.delete(
  '/questions/:questionId/answers/:answerId',
  async (req, res, next) => {
    try {
      const answer = await req.repositories.questionRepo.deleteAnswer(
        req.params.questionId,
        req.params.answerId
      )

      res.json(answer)
    } catch (error) {
      next(error)
    }
  }
)

router.use((err, req, res, next) => {
  return res.status(500).json({
    error: `Something went wrong!`,
    message: err.message
  })
})

module.exports = router
