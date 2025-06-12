import {
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'

interface Contract {
    contractReference: string
    terminationDate: string
    effectiveDate: string
    contractorReference: string
    isRaisable: boolean
    }

export const getContracts = async (
  isActive?: boolean,
  contractorReference?: string
): Promise<ApiResponseType<Contract[] | null>> => {
  try {
    const contracts = await frontEndApiRequest({
      method: 'get',
      path: `/api/backoffice/contracts?IsActive=${isActive ? isActive : ''}&ContractorReference=${contractorReference ? contractorReference : ''}`,
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