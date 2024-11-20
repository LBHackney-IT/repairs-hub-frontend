import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import WorkOrdersTable from './WorkOrdersTable'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import WorkOrdersFilterView from './Filter/WorkOrdersFilterView'
import { setFilterOptions } from '@/utils/helpers/filter'
import { GridColumn, GridRow } from '../Layout/Grid'
import Meta from '../Meta'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { paramsSerializer } from '@/utils/urls'
import { convertValuesOfObjectToArray } from '@/utils/helpers/array'

const WORK_ORDERS_MANAGEMENT_PAGE_SIZE = 10

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
  }

  const clearFilters = (e) => {
    e.preventDefault()

    document
      .querySelectorAll('.govuk-checkboxes__input')
      .forEach((elem) => (elem.checked = false))

    setAppliedFilters({})
    updateUrlQueryParams({})
  }

  const onFilterRemove = (category, indexNumber) => {
    const updatedAppliedFilters = convertValuesOfObjectToArray(queryParams, [
      'pageNumber',
      'IncludeHistorical',
    ])
    switch (category.toLowerCase()) {
      case 'contractor':
        updatedAppliedFilters.ContractorReference.splice(indexNumber, 1)
        break
      case 'priority':
        updatedAppliedFilters.Priorities.splice(indexNumber, 1)
        break
      case 'status':
        updatedAppliedFilters.StatusCode.splice(indexNumber, 1)
        break
      case 'trade':
        updatedAppliedFilters.TradeCodes.splice(indexNumber, 1)
        break
    }

    updateUrlQueryParams(updatedAppliedFilters)
    delete updatedAppliedFilters['pageNumber']
    setAppliedFilters(updatedAppliedFilters)
  }

  const workOrderView = async (pageNumber, filterOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const workOrders = await frontEndApiRequest({
        method: 'get',
        path: '/api/workOrders/',
        params: {
          PageSize: WORK_ORDERS_MANAGEMENT_PAGE_SIZE,
          PageNumber: pageNumber,
          ...(filterOptions.StatusCode && {
            StatusCode: filterOptions.StatusCode,
          }),
          ...(filterOptions.Priorities && {
            Priorities: filterOptions.Priorities,
          }),
          ...(filterOptions.TradeCodes && {
            TradeCodes: filterOptions.TradeCodes,
          }),
          ...(filterOptions.ContractorReference && {
            ContractorReference: filterOptions.ContractorReference,
          }),
          IncludeHistorical: false,
        },
        paramsSerializer,
      })

      setWorkOrders(workOrders)
    } catch (e) {
      setWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(e.response?.data?.message)}`
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
            appliedFilters={convertValuesOfObjectToArray(queryParams, [
              'pageNumber',
              'IncludeHistorical',
            ])}
            clearFilters={clearFilters}
            onFilterRemove={onFilterRemove}
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
                    pageSize={WORK_ORDERS_MANAGEMENT_PAGE_SIZE}
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
