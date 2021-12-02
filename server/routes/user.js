import express from 'express'
import { Read } from '../controllers/user.js'
import { authMiddleware, adminMiddleware } from '../controllers/auth.js'

const router = express.Router()

router.get('/user', authMiddleware, Read)
router.get('/admin', authMiddleware, adminMiddleware, Read)

export default router
