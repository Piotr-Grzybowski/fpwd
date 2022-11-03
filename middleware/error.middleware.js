const HttpException = require('../httpException/HttpException')

module.exports = errorHandler = (error, req, res, next) => {
  let customError

  if (!(error instanceof HttpException)) {
    customError = new HttpException(500, 'Something went wrong!')
  }

  res.status(customError.statusCode).send(customError.message)
}
