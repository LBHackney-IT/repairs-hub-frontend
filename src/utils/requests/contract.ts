import Contract from '../../models/contract'
import ContractDashboardContractor from '../../models/contractDashboardContractor'
import { frontEndApiRequest } from '../frontEndApiClient/requests'

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

// export const fetchContract = async (
//   contractReference: string
// ): Promise<ContractDashboardContractor | null> => {
//   const contract = await frontEndApiRequest({
//     method: 'get',
//     path: `/api/backoffice/contract/${contractReference}`,
//   })

//   return contract
// }
