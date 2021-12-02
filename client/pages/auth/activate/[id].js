import { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { withRouter } from 'next/router'
import {
  showErrorMessage,
  showSuccessMessage,
  showWarningMessage,
} from '../../../helpers/alerts'
import { API } from '../../../config'
import Layout from '../../../components/Layout'

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activate Account',
    success: '',
    warning: '',
    error: '',
  })

  const { name, token, buttonText, success, warning, error } = state

  useEffect(() => {
    let token = router.query.id
    if (token) {
      const { name } = jwt.decode(token)
      setState({ ...state, name, token })
    }
  }, [router])

  const clickSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, buttonText: 'Activating' })

    try {
      const response = await axios.post(`${API}/register/activate`, { token })
      console.log(response)
      setState({
        ...state,
        name: '',
        token: '',
        buttonText: 'Activated',
        success: response.data.message,
      })
    } catch (error) {
      console.log(error)
      setState({
        buttonText: 'Activate Account',
        error: error.response.data.error,
      })
    }
  }

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h1>G'day {name}, ready to activate your account?</h1>
          <br />
          {success && showSuccessMessage(success)}
          {warning && showWarningMessage(warning)}
          {error && showErrorMessage(error)}
          <button className='btn btn-primary btn-block' onClick={clickSubmit}>
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(ActivateAccount)
