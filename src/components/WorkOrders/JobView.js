import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import JobsTable from './JobsTable'
import {
  getRepairs,
  getPendingApprovalRepairs,
} from '../../utils/frontend-api-client/repairs'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import UserContext from '../UserContext/UserContext'

const JobView = ({ pageNumber }) => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const workOrderView = async (pageNumber) => {
    setError(null)

    try {
      var data = []

      if (user.hasContractorPermissions) {
        data = await getRepairs(pageNumber)
      } else if (user.hasContractManagerPermissions) {
        data = await getPendingApprovalRepairs(pageNumber)
      }

      setWorkOrders(data)
    } catch (e) {
      setWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
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
