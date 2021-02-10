import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import JobsTable from './JobsTable'
import { getRepairs } from '../../utils/frontend-api-client/repairs'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { sortObjectsByDateKey } from '../../utils/date'

const JobView = ({ pageNumber }) => {
  const router = useRouter()
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
    workOrderView(pageNumber)
  }, [])

  const handlePageClick = (newPageNumber) => {
    setLoading(true)
    workOrderView(newPageNumber)
    updatePageNumber(newPageNumber)
  }

  const updatePageNumber = (newPageNumber) => {
    router.push({
      pathname: '/',
      query: {
        pageNumber: encodeURI(newPageNumber),
      },
    })
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
