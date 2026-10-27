import { useState, useEffect, MouseEvent } from 'react'
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
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import type { PageProps } from '@/types/page'

type Filters = Record<string, any>

const WORK_ORDERS_MANAGEMENT_PAGE_SIZE = 10

// Saved filter preset in local storage, used as the default filters when the URL has none
const getDefaultFilters = (): Filters | null =>
  JSON.parse(localStorage.getItem('RH - default work order filters'))

const WorkOrdersView = ({ query: urlQuery }: PageProps) => {
  const query: Filters =
    Object.entries(urlQuery).length === 0 ? getDefaultFilters() : urlQuery
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState<any>([])
  const [error, setError] = useState<string | null>()
  const [loading, setLoading] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<Filters>()
  const pageNumber = parseInt(query?.pageNumber || '1')
  const queryParams = appliedFilters || query || {}

  const onFilterSubmit = async (
    formData: Record<string, Record<string, unknown>>
  ) => {
    const setFilters = setFilterOptions(formData)
    setAppliedFilters(setFilters)
    updateUrlQueryParams(setFilters)
  }

  const clearFilters = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    document
      .querySelectorAll('.govuk-checkboxes__input')
      .forEach((elem: HTMLInputElement) => (elem.checked = false))

    setAppliedFilters({})
    updateUrlQueryParams({})
  }

  const onFilterRemove = (category: string, indexNumber: number) => {
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

  const workOrderView = async (
    pageNumber: number,
    filterOptions: Filters = {}
  ) => {
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
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    workOrderView(pageNumber, query)
  }, [])

  const handlePageClick = (newPageNumber: number) => {
    setLoading(true)
    workOrderView(newPageNumber, queryParams)
    updateUrlQueryParams(queryParams, newPageNumber)
  }

  const updateUrlQueryParams = (filters: Filters, pageNumber = 1) => {
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
