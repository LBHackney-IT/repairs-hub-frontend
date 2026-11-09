import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import type { Contractor } from './hooks/useSelectContract'

export const fetchContractors = async (): Promise<Contractor[]> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}
