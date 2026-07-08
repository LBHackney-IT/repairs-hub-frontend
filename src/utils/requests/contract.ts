import Contract from '../../models/contract'
import { frontEndApiRequest } from '../frontEndApiClient/requests'

interface FetchContractsArguments {
  isActive?: Boolean
  contractorReference?: string
  sorCode?: string
}

export const fetchContracts = async ({
  isActive,
  contractorReference,
  sorCode,
}: FetchContractsArguments): Promise<Contract[] | null> => {
  const params = {}

  if (isActive !== null && isActive !== undefined) params['isActive'] = isActive
  if (contractorReference !== null && contractorReference !== '')
    params['contractorReference'] = contractorReference
  if (sorCode !== null && sorCode !== '') params['sorCode'] = sorCode

  const contracts = await frontEndApiRequest({
    method: 'get',
    path: `/api/backoffice/contracts`,
    params: params,
  })

  return contracts
}