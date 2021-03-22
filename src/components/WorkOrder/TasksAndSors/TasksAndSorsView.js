import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import TasksAndSorsTable from './TasksAndSorsTable'
import { getTasksAndSors } from '../../../utils/frontend-api-client/repairs/[id]/tasks'
import { sortObjectsByDateKey } from '../../../utils/date'

const TasksAndSorsView = ({ workOrderReference, tabName }) => {
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const originalTasksAndSors = tasksAndSors.filter((t) => t.original)

  const getTasksAndSorsView = async (workOrderReference) => {
    setError(null)

    try {
      const tasksAndSors = await getTasksAndSors(workOrderReference)

      setTasksAndSors(
        sortObjectsByDateKey(tasksAndSors, ['dateAdded'], 'dateAdded')
      )
    } catch (e) {
      setTasksAndSors(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
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
          {tasksAndSors && (
            <TasksAndSorsTable
              /**
                Latest refers to the latest (live) tasks and sors against the work order,
                which will include any variations for different codes and quantities
                whereas original refers to the tasks and sors that originated from
                the raise repair form, along with its original quantity
              **/
              latestTasksAndSors={tasksAndSors}
              originalTasksAndSors={originalTasksAndSors}
              tabName={tabName}
            />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

TasksAndSorsView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default TasksAndSorsView
