import { frontEndApiRequest } from '../../frontEndApiClient/requests'

export type SorContractsMode = 'Copy' | 'Add'

export interface SorContractsRequest {
  sourcePropertyReference: string
  destinationPropertyReference: string
  contractReference: string
  mode: SorContractsMode
}

export const saveContractChangesToDatabaseRequest = async (
  data: SorContractsRequest
) => {
  return await frontEndApiRequest({
    method: 'POST',
    path: `/api/backOffice/sor-contracts`,
    requestData: data,
  })
}
