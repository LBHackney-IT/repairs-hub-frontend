import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import NotesForm from './NotesForm'
import NotesTimeline from './NotesTimeline'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { sortObjectsByDateKey } from '@/utils/date'
import { TabName } from '../../Tabs/tabNames'
import { WorkOrder } from '@/root/src/models/workOrder'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

interface Props {
  workOrderReference: string
  tabName: string
  workOrder: WorkOrder
  setActiveTab: (tabName: TabName) => void
}

const NotesView = (props: Props) => {
  const { workOrderReference, tabName, workOrder, setActiveTab } = props

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

export default NotesView
