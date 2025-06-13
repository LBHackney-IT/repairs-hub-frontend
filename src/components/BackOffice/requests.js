import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'

export const fetchContractors = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}

export const fetchActiveContractsByContractorReference = async (
  contractorReference
) => {
  return await frontEndApiRequest({
    method: 'get',
    path: `/api/backoffice/contracts?IsActive=true&ContractorReference=${contractorReference}`,
  })
}
