const { writeFile, rm } = require('fs/promises')
const { makeQuestionRepository } = require('./question.repository')
const { v4: uuidv4 } = require('uuid')

describe('Testing question repository', () => {
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

    expect(await questionRepo.getQuestions()).toHaveLength(testQuestions.length)
  })

  it('should return question object when given valid ID', async () => {
    expect(
      await questionRepo.getQuestionById(idOfSecondQuestion)
    ).toStrictEqual(testQuestions[1])
  })

  it('should return empty array when given invalid id', async () => {
    expect(await questionRepo.getQuestionById(invalidId)).toHaveLength(0)
  })

  it('should add new question to the list when given valid question data', async () => {
    const addedQuestion = await questionRepo.addQuestion(extraTestQuestion)
    const questions = await questionRepo.getQuestions()
    expect(questions[2]).toEqual(expect.objectContaining(extraTestQuestion))
  })

  it('should update question when given valid id and valid question data', async () => {
    const updateData = {
      summary: 'What is my name?',
      author: 'Jack Berlin',
      answers: []
    }
    const updatedQuestion = await questionRepo.updateQuestion(
      updateData,
      idOfFirstQuestion
    )

    expect(await questionRepo.getQuestionById(idOfFirstQuestion)).toEqual(
      expect.objectContaining(updateData)
    )
  })

  it('should delete question when given valid id', async () => {
    const questions = await questionRepo.getQuestions()
    const deletedQuestion = await questionRepo.deleteQuestion(
      idOfSecondQuestion
    )

    expect(await questionRepo.getQuestions()).toHaveLength(questions.length - 1)
  })

  describe('Testing answers', () => {
    it('should return empty array of answers', async () => {
      expect(await questionRepo.getAnswers(idOfFirstQuestion)).toHaveLength(0)
    })

    it('should return a list of 2 answers', async () => {
      const firstAnswer = {
        author: 'Brian McKenzie',
        summary: 'The Earth is flat.'
      }
      const secondAnswer = {
        author: 'Dr Strange',
        summary: 'It is egg-shaped.'
      }

      await questionRepo.addAnswer(idOfFirstQuestion, firstAnswer)
      await questionRepo.addAnswer(idOfFirstQuestion, secondAnswer)

      expect(await questionRepo.getAnswers(idOfFirstQuestion)).toHaveLength(2)
    })

    it('should return answer object when given a proper id', async () => {
      const answers = await questionRepo.getAnswers(idOfFirstQuestion)
      const idOfFirstAnswer = answers[0].id
      const firstAnswer = answers[0]

      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toStrictEqual(firstAnswer)
    })

    it('should return empty array instead of answer when given invalid Id', async () => {
      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, invalidId)
      ).toHaveLength(0)
    })

    it('should update answer when given valid id', async () => {
      const answers = await questionRepo.getAnswers(idOfFirstQuestion)
      const idOfFirstAnswer = answers[0].id
      const updatedAnswer = {
        author: 'Dylan Bob',
        summary: 'No atmosphere, no sound'
      }

      await questionRepo.updateAnswer(
        idOfFirstQuestion,
        idOfFirstAnswer,
        updatedAnswer
      )

      expect(
        await questionRepo.getAnswer(idOfFirstQuestion, idOfFirstAnswer)
      ).toEqual(expect.objectContaining(updatedAnswer))
    })

    it('should delete answer when given valid id', async () => {
      const answers = await questionRepo.getAnswers(idOfFirstQuestion)
      const idOfFirstAnswer = answers[0].id

      await questionRepo.deleteAnswer(idOfFirstQuestion, idOfFirstAnswer)

      expect(await questionRepo.getAnswers(idOfFirstQuestion)).toHaveLength(
        answers.length - 1
      )
    })
  })
})
