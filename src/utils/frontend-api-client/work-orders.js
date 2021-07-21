import axios from 'axios'
import { paramsSerializer } from '../urls'

export const PAGE_SIZE_CONTRACTORS = 10
export const PAGE_SIZE_AGENTS = 50
const SORT_BY_FOR_PROPERTY = 'dateraised:desc'

export const getWorkOrders = async (pageNumber = 1, options) => {
  const { data } = await axios.get('/api/workOrders/', {
    params: {
      PageSize: PAGE_SIZE_CONTRACTORS,
      PageNumber: pageNumber,
      ...(options.StatusCode && { StatusCode: options.StatusCode }),
      ...(options.Priorities && { Priorities: options.Priorities }),
      ...(options.TradeCodes && { TradeCodes: options.TradeCodes }),
      ...(options.ContractorReference && {
        ContractorReference: options.ContractorReference,
      }),
    },
    paramsSerializer,
  })

  return data
}

export const getWorkOrdersForProperty = async (
  propertyReference,
  pageNumber = 1
) => {
  const { data } = await axios.get('/api/workOrders/', {
    params: {
      propertyReference: propertyReference,
      PageSize: PAGE_SIZE_AGENTS,
      PageNumber: pageNumber,
      sort: SORT_BY_FOR_PROPERTY,
    },
  })

  return data
}
