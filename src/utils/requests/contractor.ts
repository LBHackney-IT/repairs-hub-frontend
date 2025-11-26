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

interface FetchContractorsArguments {
  contractsExpiryFilterDate: Date
}

export const fetchContractors = async ({
  contractsExpiryFilterDate,
}: FetchContractorsArguments): Promise<Contractor[] | null> => {
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

interface FetchContractorsRelatedToPropertyAndTradeCodeArguments {
  propertyReference: string
  tradeCode: string
}

export const fetchContractorsRelatedToPropertyAndTradeCode = async ({
  propertyReference,
  tradeCode,
}: FetchContractorsRelatedToPropertyAndTradeCodeArguments): Promise<
  ApiResponseType<Contractor[] | null>
> => {
  const params = {}
  if (propertyReference !== null && propertyReference !== '')
    params['propertyReference'] = propertyReference
  if (tradeCode !== null && tradeCode !== '') params['tradeCode'] = tradeCode
  try {
    const contractorsRelatedToProperty = await frontEndApiRequest({
      method: 'get',
      path: '/api/contractors',
      params: params,
    })
    return {
      success: true,
      response: contractorsRelatedToProperty,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `No contractors related to ${propertyReference} property.`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}
