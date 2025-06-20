import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import NotesForm from './NotesForm'
import NotesTimeline from './NotesTimeline'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { sortObjectsByDateKey } from '@/utils/date'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

const NotesView = ({
  workOrderReference,
  tabName,
  workOrder,
  setActiveTab,
}) => {
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
      setError(formatRequestErrorMessage(e))
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
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getNotesView(workOrderReference)
  }, [])

  if (loading) return <Spinner />

  return (
    <>
      <NotesForm
        onFormSubmit={onFormSubmit}
        tabName={tabName}
        workOrderReference={workOrderReference}
        displayForm={displayForm}
        showForm={showForm}
      />
      {notes && (
        <NotesTimeline
          notes={notes}
          workOrder={workOrder}
          setActiveTab={setActiveTab}
        />
      )}
      {error && <ErrorMessage label={error} />}
    </>
  )
}

NotesView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
  workOrder: PropTypes.object.isRequired,
  setActiveTab: PropTypes.func.isRequired,
}

export default NotesView
