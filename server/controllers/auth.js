import { connectAWS } from '../config/aws.js'
import {
  registerEmailParams,
  forgotPasswrodEmailParams,
} from '../helpers/email.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import shortId from 'shortid'
import _ from 'lodash'

const ses = connectAWS()

export const Register = (req, res) => {
  const { name, email, password } = req.body

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      })
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '10m',
      }
    )

    const params = registerEmailParams(email, token)

    const sendEmailOnRegister = ses.sendEmail(params).promise()

    sendEmailOnRegister
      .then((data) => {
        console.log('Email submitted to SES', data)
        res.json({
          message: `Email has been sent to ${email}. Follow the instructions to complete your registration`,
        })
      })
      .catch((error) => {
        console.log('ses email on register', error)
        res.status(202).json({
          message: `We could not verify your email. Please try again`,
        })
      })
  })
}

export const registerActivate = (req, res) => {
  const { token } = req.body
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: 'Expired link. Try again',
        })
      }

      const { name, email, password } = jwt.decode(token)
      const username = shortId.generate()

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(401).json({
            error: 'Email is taken',
          })
        }

        const newUser = new User({ username, name, email, password })
        newUser.save((err, result) => {
          if (err) {
            return res.status(401).json({
              error: 'Error saving user in database. Try later',
            })
          }
          return res.json({
            message: 'Registration success. Please login',
          })
        })
      })
    }
  )
}

export const Login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    })
  }
  if (!user.authenticate(password)) {
    return res.status(401).json({
      error: 'Email and password do not match',
    })
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  const { _id, name, role } = user
  return res.json({
    token,
    user: { _id, name, email, role },
  })
}

export const authMiddleware = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded._id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
}

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export const forgotPassword = (req, res, next) => {
  const { email } = req.body

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist',
      })
    }
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: '10m' }
    )

    const params = forgotPasswrodEmailParams(email, token)

    return User.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: 'Password reset failed. Try later',
        })
      }

      const sendEmail = ses.sendEmail(params).promise()
      sendEmail
        .then((data) => {
          console.log('ses reset pw success', data)
          return res.json({
            message: `Email has been sent tp ${email}. Click on the link to reset your password`,
          })
        })
        .catch((error) => {
          console.log('ses reset pw failed', error)
          return res.json({
            message: `We could not verify your email. Try later`,
          })
        })
    })
  })
}

export const resetPassword = (req, res, next) => {
  const { resetPasswordLink, newPassword } = req.body

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: 'Expired Link. Try again.',
          })
        }
        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Invalid token. Try again',
            })
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          }

          user = _.extend(user, updatedFields)

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: 'Password reset failed. Try again.',
              })
            }

            res.json({
              message: 'Great! Now you can login with your new password',
            })
          })
        })
      }
    )
  }
}
