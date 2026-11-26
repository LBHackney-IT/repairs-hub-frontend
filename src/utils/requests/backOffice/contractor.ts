import { frontEndApiRequest } from '../../frontEndApiClient/requests'
import type { ContractorOption } from '../../../models/contractorOption'
import Contractor from '../../../models/contractor'

export const fetchContractorsRequest = async (): Promise<
  ContractorOption[]
> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}

interface FetchContractorsWithContractsArguments {
  contractsExpiryFilterDate: Date
}

export const fetchContractorsWithContractsRequest = async ({
  contractsExpiryFilterDate,
}: FetchContractorsWithContractsArguments): Promise<Contractor[] | null> => {
  const params = {}
  if (contractsExpiryFilterDate !== null)
    params['contractsExpiryFilterDate'] = contractsExpiryFilterDate

  const contractors = await frontEndApiRequest({
    method: 'get',
    path: '/api/backoffice/contractors',
    params: params,
  })

  return contractors
}
