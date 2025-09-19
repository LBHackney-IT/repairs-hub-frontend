import Contractor from '../../models/contractor'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const getContractor = async (
  contractorReference: string
): Promise<ApiResponseType<Contractor | null>> => {
  try {
    const contractor = await frontEndApiRequest({
      method: 'get',
      path: `/api/contractors/${contractorReference}`,
    })

    return {
      success: true,
      response: contractor,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Failed to fetch contractor with reference ${contractorReference}`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}
