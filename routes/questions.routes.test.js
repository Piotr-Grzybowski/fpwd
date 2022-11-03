const app = require('../app')
const { writeFile, rm, rename } = require('fs/promises')
const supertest = require('supertest')
const { v4: uuidv4 } = require('uuid')
const request = supertest(app)

describe('Testing Question Routes and validation', () => {
  const idOfFirstQuestion = uuidv4()
  const idOfFirstAnswer = uuidv4()
  const firstQuestion = {
    id: idOfFirstQuestion,
    summary: 'First Summary',
    author: 'First Author',
    answers: [
      {
        id: idOfFirstAnswer,
        author: 'John',
        summary: 'Octopus'
      }
    ]
  }

  beforeAll(async () => {
    await writeFile('questions-test.json', JSON.stringify([firstQuestion]))
  })

  afterAll(async () => {
    await rm('questions-error.json')
  })

  describe('Testing validator', () => {
    const invalidQuestion = {
      author: '',
      summary: 'Something',
      answers: []
    }
    const validQuestion = {
      author: 'Sam',
      summary: 'with Frodo',
      answers: []
    }
    const validAnswer = {
      author: 'John',
      summary: 'NotKennedy'
    }
    const invalidAnswer = {
      author: 'James',
      summary: ''
    }

    it('should return error when invalid question given', async () => {
      const response = await request.post('/questions').send(invalidQuestion)

      expect(response.status).toBe(422)
      expect(response.body.error).toBe('"author" is not allowed to be empty')
    })

    it('should return status code 200 when valid question given', async () => {
      const response = await request.post('/questions').send(validQuestion)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          author: validQuestion.author,
          summary: validQuestion.summary,
          id: expect.any(String)
        })
      )
    })

    it('should return error when invalid answer data given', async () => {
      const response = await request
        .post(`/questions/${idOfFirstQuestion}/answers`)
        .send(invalidAnswer)

      expect(response.status).toBe(422)
      expect(response.body.error).toBe('"summary" is not allowed to be empty')
    })

    it('should return status code 200 when valid answer data given', async () => {
      const response = await request
        .post(`/questions/${idOfFirstQuestion}/answers`)
        .send(validAnswer)

      expect(response.status).toBe(200)
      expect(response.body.answers[1]).toEqual(
        expect.objectContaining(validAnswer)
      )
    })
  })

  describe('Testing endpoints', () => {
    it('should return list of 3 questions', async () => {
      const response = await request.get('/questions')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
    })

    it('should return list of 2 answers', async () => {
      const response = await request.get(
        `/questions/${idOfFirstQuestion}/answers`
      )

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
    })

    it('should update question properties', async () => {
      const newQuestion = {
        author: 'No',
        summary: 'Nope',
        answers: [
          {
            id: idOfFirstAnswer,
            author: 'John',
            summary: 'Octopus'
          }
        ]
      }
      const response = await request
        .put(`/questions/${idOfFirstQuestion}`)
        .send(newQuestion)

      expect(response.body).toHaveProperty('author', newQuestion.author)
      expect(response.body).toHaveProperty('summary', newQuestion.summary)
    })

    it('should update answer properties', async () => {
      const newAnswer = {
        author: 'No',
        summary: 'Nope'
      }
      const response = await request
        .put(`/questions/${idOfFirstQuestion}/answers/${idOfFirstAnswer}`)
        .send(newAnswer)

      expect(response.body).toHaveProperty('author', newAnswer.author)
      expect(response.body).toHaveProperty('summary', newAnswer.summary)
    })

    it('should return question with given id', async () => {
      const response = await request.get(`/questions/${idOfFirstQuestion}`)

      expect(response.body).toHaveProperty('id', idOfFirstQuestion)
    })

    it('should return answer with given id', async () => {
      const response = await request.get(
        `/questions/${idOfFirstQuestion}/answers/${idOfFirstAnswer}`
      )

      expect(response.body).toHaveProperty('id', idOfFirstAnswer)
    })

    it('should delete answer with given id', async () => {
      const response = await request.delete(
        `/questions/${idOfFirstQuestion}/answers/${idOfFirstAnswer}`
      )
      const answersList = await request.get(
        `/questions/${idOfFirstQuestion}/answers/`
      )
      const deletedAnswer = await request.get(
        `/questions/${idOfFirstQuestion}/answers/${idOfFirstAnswer}`
      )

      expect(answersList.body).toHaveLength(0)
      expect(deletedAnswer.body).toHaveLength(0)
    })

    it('should delete question with given id', async () => {
      const response = await request.delete(`/questions/${idOfFirstQuestion}`)
      const questionsList = await request.get(`/questions/`)
      const deletedQuestion = await request.get(
        `/questions/${idOfFirstQuestion}`
      )

      expect(questionsList.body).toHaveLength(1)
      expect(deletedQuestion.body).toHaveLength(0)
    })
  })

  describe('Error handling', () => {
    //   // I will rename the db file to simulate an error
    //   // Error middleware should catch error and respond with
    //   // 500 status code and general error message

    it('should catch an error and give proper response', async () => {
      await rename('./questions-test.json', './questions-error.json')
      const response = await request.get('/questions')

      expect(response.status).toBe(500)
      expect(response.text).toEqual('Something went wrong!')
    })

    it('should return 404 when no resource found', async () => {
      const response = await request.get('/notExistingRoute')

      expect(response.status).toBe(404)
      expect(response.text).toEqual('Resource not found')
    })
  })
})
