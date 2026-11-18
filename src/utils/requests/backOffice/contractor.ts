import { frontEndApiRequest } from '../../frontEndApiClient/requests'
import type { ContractorOption } from '../../../models/contractorOption'

export const fetchContractorsRequest = async (): Promise<
  ContractorOption[]
> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}
