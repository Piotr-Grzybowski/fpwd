const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories.middleware')
const questionRouter = require('./routes/questions.routes')
const errorHandler = require('./middleware/error.middleware')
const notFoundHandler = require('./middleware/404.middleware')
const path = require('path')
require('dotenv').config()

const STORAGE_FILE_PATH =
  process.env.NODE_ENV === 'testing'
    ? './questions-test.json'
    : './questions.json'

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))
app.use('/questions', questionRouter)
app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})
app.use(errorHandler)
app.use(notFoundHandler)

module.exports = app
