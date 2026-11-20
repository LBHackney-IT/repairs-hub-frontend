import { useState, useEffect, MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { setFilterOptions } from '@/utils/helpers/filter'
import { paramsSerializer } from '@/utils/urls'
import { convertValuesOfObjectToArray } from '@/utils/helpers/array'
import {
  buildUrlQuery,
  buildWorkOrdersParams,
  removeFilter,
} from '@/utils/helpers/workOrdersFilters'
import { formatRequestErrorMessage } from '@/utils/errorHandling/formatErrorMessage'
import { fetchWorkOrdersRequest } from '@/requests/workOrders'

type Filters = Record<string, any>

// Saved filter preset in local storage, used as the default filters when the URL has none
const getDefaultFilters = (): Filters =>
  JSON.parse(localStorage.getItem('RH - default work order filters')) ?? {}

// Must only be called in the browser, as it reads local storage
export const useWorkOrdersView = (urlQuery: Record<string, any>) => {
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
    const updatedAppliedFilters = removeFilter(
      queryParams,
      category,
      indexNumber
    )

    updateUrlQueryParams(updatedAppliedFilters)
    setAppliedFilters(updatedAppliedFilters)
  }

  const loadWorkOrders = async (
    pageNumber: number,
    filterOptions: Filters = {}
  ) => {
    setLoading(true)
    setError(null)

    try {
      const workOrders = await fetchWorkOrdersRequest(
        buildWorkOrdersParams(filterOptions, pageNumber),
        paramsSerializer
      )

      setWorkOrders(workOrders)
    } catch (e) {
      setWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  // Refetch whenever the URL query changes (applying/clearing filters, paging, back/forward)
  const queryKey = JSON.stringify(query)

  useEffect(() => {
    loadWorkOrders(pageNumber, query)
  }, [queryKey])

  const handlePageClick = (newPageNumber: number) => {
    setLoading(true)
    updateUrlQueryParams(queryParams, newPageNumber)
  }

  const updateUrlQueryParams = (filters: Filters, pageNumber = 1) => {
    router.push({
      pathname: '/',
      query: buildUrlQuery(filters, pageNumber),
    })
  }

  return {
    workOrders,
    loading,
    error,
    pageNumber,
    appliedFilters: convertValuesOfObjectToArray(queryParams, [
      'pageNumber',
      'IncludeHistorical',
    ]),
    onFilterSubmit,
    clearFilters,
    onFilterRemove,
    handlePageClick,
  }
}
