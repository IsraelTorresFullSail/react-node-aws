import pkg from 'express-validator'
const { body } = pkg

export const userRegisterValidator = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be al least 6 characters long'),
]

export const userLoginValidator = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be al least 6 characters long'),
]

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Must be a valid email address'),
]

export const resetPasswordValidator = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be al least 6 characters long'),
  body('resetPasswordLink').not().isEmpty().withMessage('Token is required'),
]
