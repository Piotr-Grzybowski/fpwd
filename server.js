const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const questionRouter = require('./routes/question')

const STORAGE_FILE_PATH = 'questions.json'

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))
app.use('/', questionRouter)

module.exports = app
