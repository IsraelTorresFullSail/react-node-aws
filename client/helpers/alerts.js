export const showSuccessMessage = (success) => (
  <div className='alert alert-success' role='alert'>
    {success}
  </div>
)

export const showWarningMessage = (warning) => (
  <div className='alert alert-warning' role='alert'>
    {warning}
  </div>
)

export const showErrorMessage = (error) => (
  <div className='alert alert-danger' role='alert'>
    {error}
  </div>
)
