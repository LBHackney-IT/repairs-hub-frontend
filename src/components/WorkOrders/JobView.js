import { useState, useEffect } from 'react'
import JobsTable from './JobsTable'
import { getRepairs } from '../../utils/frontend-api-client/repairs'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { sortedByDate } from '../../utils/date'

const JobView = () => {
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const workOrderView = async () => {
    setError(null)

    try {
      const data = await getRepairs()

      setWorkOrders(sortedByDate(data))
    } catch (e) {
      setWorkOrders(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    workOrderView()
  }, [])
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {workOrders && <JobsTable workOrders={workOrders} />}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default JobView
