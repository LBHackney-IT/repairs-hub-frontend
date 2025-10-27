import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import Contract from '@/models/contract'
import Contractor from '@/models/contractor'

export const fetchContractors = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}

interface FetchContractorsArguments {
  contractsExpiryFilterDate: Date
}

export const backOfficeFetchContractors = async ({
  contractsExpiryFilterDate,
}: FetchContractorsArguments): Promise<Contractor[] | null> => {
  const params = {}
  if (contractsExpiryFilterDate !== null)
    params['contractsExpiryFilterDate'] = contractsExpiryFilterDate

  const contractors = await frontEndApiRequest({
    method: 'get',
    path: '/api/backoffice/contractors?',
    params: params,
  })

  return contractors
}

interface FetchContractsArguments {
  isActive: boolean | undefined
  contractorReference: string | undefined
  sorCode: string | undefined
}

export const fetchContracts = async ({
  isActive,
  contractorReference,
  sorCode,
}: FetchContractsArguments): Promise<Contract[] | null> => {
  const params = {}

  if (typeof isActive === 'boolean') params['isActive'] = isActive
  if (contractorReference !== null && contractorReference !== '')
    params['contractorReference'] = contractorReference
  if (sorCode !== null && sorCode !== '') params['sorCode'] = sorCode

  const contracts = await frontEndApiRequest({
    method: 'get',
    path: `/api/backoffice/contracts?`,
    params: params,
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
