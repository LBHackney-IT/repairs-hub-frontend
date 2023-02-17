import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

export const fetchTrades = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/trades?getAllTrades=true',
  })
}

export const saveSorCodesToDatabase = async (data) => {
  await frontEndApiRequest({
    method: 'post',
    path: `/api/backoffice/sor-codes`,
    requestData: data,
  })
}
