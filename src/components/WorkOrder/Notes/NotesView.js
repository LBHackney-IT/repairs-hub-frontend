import PropTypes from 'prop-types'
import { useState } from 'react'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import NotesForm from './NotesForm'
import { postJobStatusUpdate } from '../../../utils/frontend-api-client/job-status-update'

const NotesView = ({ workOrderReference, tabName }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      const response = await postJobStatusUpdate(formData)

      console.log('successfully posted note', response)
    } catch (e) {
      console.log(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <NotesForm
            onFormSubmit={onFormSubmit}
            tabName={tabName}
            workOrderReference={workOrderReference}
          />
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

NotesView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default NotesView
