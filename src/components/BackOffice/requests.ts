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
): Promise<ApiResponseType<Contract[] | null>> => {
  try {
    const contracts = await frontEndApiRequest({
      method: 'get',
      path: `/api/backoffice/contracts?isActive=${
        isActive ? isActive : ''
      }&contractorReference=${contractorReference ? contractorReference : ''}`,
    })

    return {
      success: true,
      response: contracts,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Could not find any contracts`
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
      ),
    }
  }
}

export const fetchContract = async (
  contractReference: string
): Promise<ApiResponseType<Contract | null>> => {
  try {
    const contract = await frontEndApiRequest({
      method: 'get',
      path: `/api/backoffice/contract/${contractReference}`,
    })

    return {
      success: true,
      response: contract,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Could not find contract with contract reference ${contractReference}`
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
      ),
    }
  }
}
