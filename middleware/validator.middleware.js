module.exports = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (!error) {
      next()
    } else {
      const { details } = error

      const message = details.map(error => error.message).join(',')

      res.status(422).json({ error: message })
    }
  }
}
