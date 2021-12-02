import pkg from 'express-validator'
const { body } = pkg

export const categoryCreateValidator = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('image').isEmpty().withMessage('Image is required'),
  body('content').isLength({ min: 20 }).withMessage('Content is required'),
]

export const categoryUpdateValidator = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('content').isLength({ min: 20 }).withMessage('Content is required'),
]
