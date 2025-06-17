import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'

export const fetchContractors = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}

export const fetchActiveContractsByContractorReference = async (
  isActive = true,
  contractorReference
) => {
  return await frontEndApiRequest({
    method: 'get',
    path: `/api/backoffice/contracts?isActive=${isActive}true&ContractorReference=${contractorReference}`,
  })
}
