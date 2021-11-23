import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import WorkOrdersTable from './WorkOrdersTable'
import { getWorkOrders } from '@/utils/frontEndApiClient/workOrders'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import WorkOrdersFilterView from './Filter/WorkOrdersFilterView'
import { setFilterOptions } from '@/utils/helpers/filter'
import { GridColumn, GridRow } from '../Layout/Grid'
import Meta from '../Meta'

const WorkOrdersView = ({ query }) => {
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState()
  const pageNumber = parseInt(query?.pageNumber || 1)
  const queryParams = appliedFilters || query || {}

  const onFilterSubmit = async (formData) => {
    const setFilters = setFilterOptions(formData)
    setAppliedFilters(setFilters)
    updateUrlQueryParams(setFilters)
    workOrderView(1, setFilters)
  }

  const clearFilters = (e) => {
    e.preventDefault()

    document
      .querySelectorAll('.govuk-checkboxes__input')
      .forEach((elem) => (elem.checked = false))

    setAppliedFilters({})
    updateUrlQueryParams({})
    workOrderView(1)
  }

  const workOrderView = async (pageNumber, filterOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getWorkOrders(pageNumber, filterOptions)

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
        ...(filters?.Priorities && { Priorities: filters.Priorities }),
        ...(filters?.TradeCodes && { TradeCodes: filters.TradeCodes }),
        ...(filters?.ContractorReference && {
          ContractorReference: filters.ContractorReference,
        }),
      },
    })
  }

  return (
    <>
      <Meta title="Manage work orders" />
      <GridRow className="manage-work-orders">
        <GridColumn
          width="one-quarter"
          className="filter-container govuk-!-padding-0"
        >
          <WorkOrdersFilterView
            onFilterSubmit={onFilterSubmit}
            appliedFilters={queryParams}
            clearFilters={clearFilters}
          />
        </GridColumn>

        <GridColumn width="three-quarters">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {workOrders && (
                <>
                  <WorkOrdersTable
                    workOrders={workOrders}
                    pageNumber={pageNumber}
                    handlePageClick={handlePageClick}
                  />
                </>
              )}
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </GridColumn>
      </GridRow>
    </>
  )
}

export default WorkOrdersView
