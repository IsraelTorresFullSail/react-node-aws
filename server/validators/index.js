import pkg from 'express-validator'
const { validationResult } = pkg

export const runValidation = (req, res, nxet) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }
  nxet()
}
