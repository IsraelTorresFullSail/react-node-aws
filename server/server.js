import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import colors from 'colors' //eslint-disable-line
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import categoryRoutes from './routes/category.js'

connectDB()

const app = express()

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
  })
)

// routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
