import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import NotesForm from './NotesForm'
import NotesTimeline from './NotesTimeline'
import { postJobStatusUpdate } from '../../../utils/frontend-api-client/job-status-update'
import { getNotes } from '../../../utils/frontend-api-client/repairs/[id]/notes'
import { sortObjectsByDateKey } from '../../../utils/date'

const NotesView = ({ workOrderReference, tabName }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [displayForm, setDisplayForm] = useState(false)

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      await postJobStatusUpdate(formData)
      setDisplayForm(false)
      getNotesView(workOrderReference)
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
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
      const notes = await getNotes(workOrderReference)

      setNotes(sortObjectsByDateKey(notes, ['time'], 'time'))
    } catch (e) {
      setNotes(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
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
