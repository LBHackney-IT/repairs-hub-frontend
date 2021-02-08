import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import TasksAndSorsTable from './TasksAndSorsTable'
import { getTasksAndSors } from '../../../utils/frontend-api-client/repairs/[id]/tasks'
import { sortObjectsByDateKey } from '../../../utils/date'

const TasksAndSorsView = ({ workOrderReference }) => {
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getTasksAndSorsView = async (workOrderReference) => {
    setError(null)

    try {
      const tasksAndSors = await getTasksAndSors(workOrderReference)

      setTasksAndSors(
        sortObjectsByDateKey(tasksAndSors, ['dateAdded'], 'dateAdded')
      )
    } catch (e) {
      setTasksAndSors(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getTasksAndSorsView(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {tasksAndSors && <TasksAndSorsTable tasksAndSors={tasksAndSors} />}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

TasksAndSorsView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default TasksAndSorsView
