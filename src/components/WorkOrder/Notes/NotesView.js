import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import NotesForm from './NotesForm'
import NotesTimeline from './NotesTimeline'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { sortObjectsByDateKey } from '@/utils/date'

const NotesView = ({ workOrderReference, tabName }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [displayForm, setDisplayForm] = useState(false)

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/jobStatusUpdate`,
        requestData: formData,
      })
      setDisplayForm(false)
      getNotesView(workOrderReference)
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const showForm = (e) => {
    e.preventDefault()

    setDisplayForm(true)
  }

  const getNotesView = async (workOrderReference) => {
    setError(null)

    try {
      const notes = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/notes`,
      })

      setNotes(sortObjectsByDateKey(notes, ['time'], 'time'))
    } catch (e) {
      setNotes(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getNotesView(workOrderReference)
  }, [])

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
            displayForm={displayForm}
            showForm={showForm}
          />
          {notes && <NotesTimeline notes={notes} />}
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
