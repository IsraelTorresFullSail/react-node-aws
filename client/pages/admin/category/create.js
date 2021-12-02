import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../../../config'
import {
  showErrorMessage,
  showSuccessMessage,
  showWarningMessage,
} from '../../../helpers/alerts'
import Layout from '../../../components/Layout'
import withAdmin from '../../withAdmin'

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: '',
    content: '',
    error: '',
    success: '',
    warning: '',
    formData: process.browser && new FormData(),
    buttonText: 'Create',
    imageUploadText: 'Upload Image',
  })
  const {
    name,
    content,
    success,
    warning,
    error,
    formData,
    buttonText,
    imageUploadText,
  } = state

  const handleChange = (name) => (e) => {
    const value = name === 'image' ? e.target.files[0] : e.target.value
    const imageName = name === 'image' ? e.target.files[0].name : 'Upload Image'
    formData.set(name, value)
    setState({
      ...state,
      [name]: value,
      error: '',
      success: '',
      warning: '',
      imageUploadText: imageName,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, buttonText: 'Creating' })

    try {
      const response = await axios.post(`${API}/category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('CATEGORY CREATE RESPONSE', response)
      setState({
        ...state,
        name: '',
        content: '',
        formData: '',
        buttonText: 'Created',
        imageUploadText: 'Upload Image',
        success: `${response.data.name} is created`,
      })
    } catch (error) {
      console.log('CATEGORY CREATE ERROR', error)
      setState({
        ...state,
        name: '',
        buttonText: 'Create',
        error: error.response.data.error,
      })
    }
  }

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <lable className='text-muted'>Name</lable>
        <input
          onChange={handleChange('name')}
          value={name}
          type='text'
          className='form-control'
          required
        />
      </div>
      <div className='form-group'>
        <lable className='text-muted'>Content</lable>
        <textarea
          onChange={handleChange('content')}
          value={content}
          className='form-control'
          required
        />
      </div>

      <div className='form-group'>
        <label className='btn btn-outline-secondary'>
          {imageUploadText}
          <input
            onChange={handleChange('image')}
            className='form-control'
            type='file'
            accept='image/*'
            hidden
          />
        </label>
      </div>
      <div>
        <button className='btn btn-success'>{buttonText}</button>
      </div>
    </form>
  )

  return (
    <Layout>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h1>Create category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {warning && showWarningMessage(warning)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  )
}

export default withAdmin(Create)
