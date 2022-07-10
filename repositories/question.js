const { writeFile } = require('fs/promises')
const { readFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    return await getData()
  }

  const getQuestionById = async questionId => {
    const fileContent = await getQuestions()
    const question =
      fileContent.filter(element => element.id === questionId)[0] || []

    return question
  }

  const addQuestion = async question => {
    const fileContent = await getQuestions()
    const questionWithId = { ...question, id: uuidv4() }
    const newFileContent = [...fileContent, questionWithId]
    await saveData(newFileContent)

    return questionWithId
  }

  const updateQuestion = async (question, questionId) => {
    const fileContent = await getQuestions()
    const questionWithId = { ...question, id: questionId }
    const newFileContent = fileContent.map(element => {
      return element.id === questionId ? questionWithId : element
    })
    await saveData(newFileContent)

    return questionWithId
  }

  const deleteQuestion = async questionId => {
    const fileContent = await getQuestions()
    const newFileContent = fileContent.filter(element => {
      return element.id !== questionId
    })
    await saveData(newFileContent)

    return
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    const answer = answers.filter(element => element.id === answerId)[0] || []

    return answer
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
    const answerWithId = { ...answer, id: answerId }
    const newQuestionContent = {
      ...question,
      answers: question.answers.map(element => {
        return answerId === element.id ? answerWithId : answer
      })
    }

    await updateQuestion(newQuestionContent, questionId)
    return answerWithId
  }

  const deleteAnswer = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)
    const newQuestionContent = {
      ...question,
      answers: question.answers.filter(answer => {
        return answer.id !== answerId
      })
    }

    return await updateQuestion(newQuestionContent, questionId)
  }

  const getData = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }
  const saveData = async newFileContent => {
    await writeFile(fileName, JSON.stringify(newFileContent))
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
