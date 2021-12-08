import axios from 'axios'
import { paramsSerializer } from '../urls'

export const PAGE_SIZE_CONTRACTORS = 10

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
      IncludeHistorical: false,
    },
    paramsSerializer,
  })

  return data
}
