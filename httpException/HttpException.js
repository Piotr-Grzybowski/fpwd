module.exports = class HttpException extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}
