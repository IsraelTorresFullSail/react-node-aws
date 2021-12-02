import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'
import {
  showErrorMessage,
  showSuccessMessage,
  showWarningMessage,
} from '../helpers/alerts'
import { API } from '../config'
import { authenticate, isAuth } from '../helpers/auth'

const Login = () => {
  const [state, setState] = useState({
    email: 'israel.a.torres01@gmail.com',
    password: '',
    error: '',
    success: '',
    warning: '',
    buttonText: 'Login',
  })

  const { email, password, error, success, warning, buttonText } = state

  useEffect(() => {
    isAuth() && Router.push('/')
  }, [])

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      warning: '',
      buttonText: 'Login',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, buttonText: 'Loggin in' })
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      })
      authenticate(response, () =>
        isAuth() && isAuth().role === 'admin'
          ? Router.push('/admin')
          : Router.push('/user')
      )
    } catch (error) {
      console.log(error)
      setState({
        ...state,
        buttonText: 'Login',
        error: error.response.data.error,
      })
    }
  }

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='email'
          className='form-control'
          placeholder='Type your email'
          required
          value={email}
          onChange={handleChange('email')}
        />
      </div>
      <div className='form-group'>
        <input
          type='password'
          className='form-control'
          placeholder='Type your password'
          required
          value={password}
          onChange={handleChange('password')}
        />
      </div>
      <div className='form-group'>
        <button className='btn btn-primary'>{buttonText}</button>
      </div>
    </form>
  )

  return (
    <Layout>
      <div className='col-md-6 offset-md-3'>
        <h1>Login</h1>
        <br />
        {success && showSuccessMessage(success)}
        {warning && showWarningMessage(warning)}
        {error && showErrorMessage(error)}
        {loginForm()}
        <Link href='/auth/password/forgot'>
          <a className='text-danger float-right'>Forgot Password</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Login
