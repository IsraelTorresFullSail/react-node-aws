import express from 'express'
import {
  categoryCreateValidator,
  categoryUpdateValidator,
} from '../validators/category.js'
import { runValidation } from '../validators/index.js'
import { authMiddleware, adminMiddleware } from '../controllers/auth.js'
import { Create, List, Read, Update, Remove } from '../controllers/category.js'

const router = express.Router()

router.post(
  '/category',
  //categoryCreateValidator,
  //runValidation,
  authMiddleware,
  adminMiddleware,
  Create
)
router.get('/categories', List)
router.get('/category/:slug', Read)
router.put(
  '/category/:slug',
  categoryUpdateValidator,
  runValidation,
  authMiddleware,
  adminMiddleware,
  Update
)
router.delete(
  '/category/:slug',

  authMiddleware,
  adminMiddleware,
  Remove
)

export default router
