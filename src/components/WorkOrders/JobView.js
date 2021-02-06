import { useState, useEffect } from 'react'
import JobsTable from './JobsTable'
import { getRepairs } from '../../utils/frontend-api-client/repairs'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { sortObjectsByDateKey } from '../../utils/date'

const JobView = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const workOrderView = async (pageNumber) => {
    setError(null)

    try {
      const data = await getRepairs(pageNumber)

      setWorkOrders(
        sortObjectsByDateKey(data, ['dateRaised', 'lastUpdated'], 'dateRaised')
      )
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

  const handlePageClick = (pageNumber) => {
    setPageNumber(pageNumber)
    workOrderView(pageNumber)
    setLoading(true)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {workOrders && (
            <JobsTable
              workOrders={workOrders}
              pageNumber={pageNumber}
              handlePageClick={handlePageClick}
            />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default JobView
