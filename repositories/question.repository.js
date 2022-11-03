const { writeFile } = require('fs/promises')
const { readFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    return await retrieveQuestionsFromDB()
  }

  const getQuestionById = async questionId => {
    const questions = await retrieveQuestionsFromDB()
    const question = questions.filter(element => element.id === questionId)

    return question[0] || ''
  }

  const addQuestion = async question => {
    const questions = await retrieveQuestionsFromDB()
    const newQuestionWithId = { ...question, id: uuidv4() }
    const newQuestions = [...questions, newQuestionWithId]
    await saveQuestionsToDB(newQuestions)

    return newQuestionWithId
  }

  const updateQuestion = async (question, questionId) => {
    const questions = await retrieveQuestionsFromDB()
    const updatedQuestionWithId = { ...question, id: questionId }
    const indexOfUpdatedQuestion = getIndex(questions, questionId)
    if (indexOfUpdatedQuestion !== -1) {
      questions[indexOfUpdatedQuestion] = updatedQuestionWithId
    }

    await saveQuestionsToDB(questions)

    return updatedQuestionWithId
  }

  const deleteQuestion = async questionId => {
    const questions = await retrieveQuestionsFromDB()
    const indexOfQuestionToDelete = getIndex(questions, questionId)
    let deletedQuestion

    if (indexOfQuestionToDelete !== -1) {
      deletedQuestion = questions.splice(indexOfQuestionToDelete, 1)
    }

    await saveQuestionsToDB(questions)

    return deletedQuestion
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    const answers = question.answers

    return answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    const answer = answers.filter(element => element.id === answerId)

    return answer[0] || ''
  }

  const addAnswer = async (questionId, answer) => {
    const question = await getQuestionById(questionId)
    const newQuestionContent = {
      ...question,
      answers: [...question.answers, { ...answer, id: uuidv4() }]
    }

    return await updateQuestion(newQuestionContent, questionId)
  }

  const updateAnswer = async (questionId, answerId, answer) => {
    const question = await getQuestionById(questionId)
    const updatedAnswerWithId = { ...answer, id: answerId }
    const indexOfAnswerToUpdate = getIndex(question.answers, answerId)
    if (indexOfAnswerToUpdate !== -1) {
      question.answers[indexOfAnswerToUpdate] = updatedAnswerWithId
    }

    return await updateQuestion(question, questionId)
  }

  const deleteAnswer = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)
    const indexOfAnswerToDelete = getIndex(question.answers, answerId)

    if (indexOfAnswerToDelete !== -1) {
      question.answers.splice(indexOfAnswerToDelete, 1)
    }

    return await updateQuestion(question, questionId)
  }

  const getIndex = (array, id) => {
    return array.findIndex(item => {
      return item.id === id
    })
  }

  const retrieveQuestionsFromDB = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }
  const saveQuestionsToDB = async newQuestions => {
    await writeFile(fileName, JSON.stringify(newQuestions))
    return
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getAnswers,
    getAnswer,
    addAnswer,
    updateAnswer,
    deleteAnswer
  }
}

module.exports = { makeQuestionRepository }
