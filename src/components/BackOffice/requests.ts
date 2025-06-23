import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import Contract from '@/models/contract'

export const fetchContractors = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}

export const fetchContracts = async (
  isActive?: boolean,
  contractorReference?: string
): Promise<Contract[] | null> => {
 
    const contracts = await frontEndApiRequest({
      method: 'get',
      path: `/api/backoffice/contracts?isActive=${
        isActive ? isActive : ''
      }&contractorReference=${contractorReference ? contractorReference : ''}`,
    })

    return contracts
}

export const fetchContract = async (
  contractReference: string
): Promise<Contract | null> => {
  
    const contract = await frontEndApiRequest({
      method: 'get',
      path: `/api/backoffice/contract/${contractReference}`,
    })

   return contract
}
