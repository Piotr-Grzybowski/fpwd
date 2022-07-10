const { writeFile, rm } = require('fs/promises')
const { makeQuestionRepository } = require('./question')
const { v4: uuidv4 } = require('uuid')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo
  const idOfFirstQuestion = uuidv4()
  const idOfSecondQuestion = uuidv4()
  const invalidId = uuidv4()
  const testQuestions = [
    {
      id: idOfFirstQuestion,
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    },
    {
      id: idOfSecondQuestion,
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    }
  ]
  const extraTestQuestion = {
    summary: 'What is my shoe size?',
    author: 'Jack London',
    answers: []
  }

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  it('should return a proper question object for proper ID', async () => {
    expect(
      await questionRepo.getQuestionById(idOfSecondQuestion)
    ).toStrictEqual(testQuestions[1])
  })

  it('should return empty array if there is no object with given id', async () => {
    expect(await questionRepo.getQuestionById(invalidId)).toHaveLength(0)
  })

  it('should add new question to the question list', async () => {
    const addedQuestion = await questionRepo.addQuestion(extraTestQuestion)

    expect(await questionRepo.getQuestionById(addedQuestion.id)).toHaveProperty(
      'id',
      addedQuestion.id
    )
    expect(await questionRepo.getQuestionById(addedQuestion.id)).toHaveProperty(
      'summary',
      addedQuestion.summary
    )
    expect(await questionRepo.getQuestionById(addedQuestion.id)).toHaveProperty(
      'author',
      addedQuestion.author
    )
    expect(await questionRepo.getQuestionById(addedQuestion.id)).toHaveProperty(
      'answers',
      addedQuestion.answers
    )
  })

  it('should update question on the question list', async () => {
    const updateData = {
      summary: 'What is my name?',
      author: 'Jack Berlin',
      answers: []
    }
    const updatedQuestion = await questionRepo.updateQuestion(
      updateData,
      idOfFirstQuestion
    )

    expect(
      await questionRepo.getQuestionById(updatedQuestion.id)
    ).toHaveProperty('author', updateData.author)
  })

  it('should delete question with given id', async () => {
    const deletedQuestion = await questionRepo.deleteQuestion(
      idOfSecondQuestion
    )
    expect(await questionRepo.getQuestions()).toHaveLength(2)

    await questionRepo.deleteQuestion(invalidId)
    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  describe('Answers array', () => {
    const firstAnswer = {
      author: 'Brian McKenzie',
      summary: 'The Earth is flat.'
    }
    const secondAnswer = {
      author: 'Dr Strange',
      summary: 'It is egg-shaped.'
    }

    it('should return empty array of answers', async () => {
      expect(await questionRepo.getAnswers(idOfFirstQuestion)).toHaveLength(0)
    })

    it('should return a list of 2 answers', async () => {
      await questionRepo.addAnswer(idOfFirstQuestion, firstAnswer)
      await questionRepo.addAnswer(idOfFirstQuestion, secondAnswer)

      expect(await questionRepo.getAnswers(idOfFirstQuestion)).toHaveLength(2)
    })

    it('should return answer object when given a proper id', async () => {
      const answers = await questionRepo.getAnswers(idOfFirstQuestion)
      const idOfFirstAnswer = answers[0].id

      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toHaveProperty('author', firstAnswer.author)
      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toHaveProperty('summary', firstAnswer.summary)
    })

    it('should return empty array instead of answer when given valid Id', async () => {
      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, invalidId)
      ).toHaveLength(0)
    })

    it('should update answer with given id', async () => {
      const answers = await questionRepo.getAnswers(idOfFirstQuestion)
      const idOfFirstAnswer = answers[0].id
      const answerBody = {
        author: 'Dylan Bob',
        summary: 'No atmosphere, no sound'
      }

      await questionRepo.updateAnswer(
        idOfFirstQuestion,
        idOfFirstAnswer,
        answerBody
      )

      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toHaveProperty('author', answerBody.author)
      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toHaveProperty('summary', answerBody.summary)
    })

    it('should delete answer with given id', async () => {
      const answers = await questionRepo.getAnswers(idOfFirstQuestion)
      const idOfFirstAnswer = answers[0].id

      await questionRepo.deleteAnswer(idOfFirstQuestion, idOfFirstAnswer)

      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toHaveLength(0)
      expect(await questionRepo.getAnswers(idOfFirstQuestion)).toHaveLength(1)
    })
  })
})
