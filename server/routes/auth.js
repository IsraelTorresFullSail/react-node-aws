import express from 'express'
import {
  Register,
  registerActivate,
  Login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.js'

import {
  userLoginValidator,
  userRegisterValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.js'
import { runValidation } from '../validators/index.js'

const router = express.Router()

router.post('/register', userRegisterValidator, runValidation, Register)
router.post('/register/activate', registerActivate)
router.post('/login', userLoginValidator, runValidation, Login)
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
)
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
)

export default router
