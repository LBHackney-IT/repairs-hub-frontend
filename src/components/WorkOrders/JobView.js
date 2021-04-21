import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import JobsTable from './JobsTable'
import { getRepairs } from '../../utils/frontend-api-client/repairs'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import WorkOrdersFilterView from './Filter/WorkOrdersFilterView'
import { setFilterOptions } from '../../utils/helpers/filter'

const JobView = ({ query }) => {
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState()
  const pageNumber = parseInt(query?.pageNumber || 1)
  const queryParams = appliedFilters || query

  const onFormSubmit = async (formData) => {
    const setFilters = setFilterOptions(formData)
    setAppliedFilters(setFilters)
    updateUrlQueryParams(setFilters)
    workOrderView(1, setFilters)
  }

  const workOrderView = async (pageNumber, filterOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getRepairs(pageNumber, filterOptions)

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
    workOrderView(pageNumber, query)
  }, [])

  const handlePageClick = (newPageNumber) => {
    setLoading(true)
    workOrderView(newPageNumber, queryParams)
    updateUrlQueryParams(queryParams, newPageNumber)
  }

  const updateUrlQueryParams = (filters, pageNumber = 1) => {
    router.push({
      pathname: '/',
      query: {
        pageNumber: pageNumber,
        ...(filters?.StatusCode && { StatusCode: filters.StatusCode }),
      },
    })
  }

  return (
    <>
      <WorkOrdersFilterView
        onFormSubmit={onFormSubmit}
        appliedFilters={queryParams}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {workOrders && (
            <>
              <JobsTable
                workOrders={workOrders}
                pageNumber={pageNumber}
                handlePageClick={handlePageClick}
              />
            </>
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default JobView
