import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'

export const fetchReports = async (
  pageNumber,
  pageSize,
  propertyReference = null
) => {
  const params = {
    pageSize,
    pageNumber,
  }

  if (propertyReference !== null) {
    params['propertyReference'] = propertyReference
  }

  return await frontEndApiRequest({
    method: 'get',
    path: '/api/damp-and-mould/reports',
    params,
  })
}
