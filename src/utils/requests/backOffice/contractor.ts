import { frontEndApiRequest } from '../../frontEndApiClient/requests'
import type { Contractor } from '../../../components/BackOffice/hooks/useSelectContract'

export const fetchContractors = async (): Promise<Contractor[]> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}
