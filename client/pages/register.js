import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Router from 'next/router'
import axios from 'axios'
import {
  showErrorMessage,
  showSuccessMessage,
  showWarningMessage,
} from '../helpers/alerts'
import { API } from '../config'
import { isAuth } from '../helpers/auth'

const Register = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    warning: '',
    buttonText: 'Register',
  })

  const { name, email, password, error, success, warning, buttonText } = state

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
      buttonText: 'Register',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, buttonText: 'Registering' })
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
      })

      if (response.status === 202) {
        setState({
          ...state,
          name: '',
          email: '',
          password: '',
          buttonText: 'Submitted',
          warning: response.data.message,
        })
      } else {
        setState({
          ...state,
          name: '',
          email: '',
          password: '',
          buttonText: 'Submitted',
          success: response.data.message,
        })
      }
    } catch (error) {
      setState({
        ...state,
        buttonText: 'Resgister',
        error: error.response.data.error,
      })
    }
  }

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='text'
          className='form-control'
          placeholder='Type your name'
          required
          value={name}
          onChange={handleChange('name')}
        />
      </div>
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
        <h1>Register</h1>
        <br />
        {success && showSuccessMessage(success)}
        {warning && showWarningMessage(warning)}
        {error && showErrorMessage(error)}
        {registerForm()}
      </div>
    </Layout>
  )
}

export default Register
