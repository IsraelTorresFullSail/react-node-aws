import { useState } from 'react'
import axios from 'axios'
import {
  showErrorMessage,
  showSuccessMessage,
  showWarningMessage,
} from '../../../helpers/alerts'
import { API } from '../../../config'
import Layout from '../../../components/Layout'

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: '',
    buttonText: 'Forgot Password',
    success: '',
    warning: '',
    error: '',
  })

  const { email, buttonText, success, warning, error } = state

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success: '', error: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`${API}/forgot-password`, { email })
      setState({
        ...state,
        email: '',
        buttonText: 'Done',
        success: response.data.message,
      })
    } catch (error) {
      console.log('FORGOT PW ERROR: ', error)
      setState({
        ...state,
        buttonText: 'Forgot Password',
        error: error.response.data.error,
      })
    }
  }

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='email'
          className='form-control'
          onChange={handleChange}
          value={email}
          placeholder='Type your email'
          required
        />
      </div>
      <div>
        <button className='btn btn-primary'>{buttonText}</button>
      </div>
    </form>
  )

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h1>Forgot Password</h1>
          {success && showSuccessMessage(success)}
          {warning && showWarningMessage(warning)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword
