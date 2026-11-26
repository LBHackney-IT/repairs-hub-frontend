import Contractor from '../../models/contractor'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { FIVE_MINUTES, queryClient } from '../queryClient'

export const contractorQuery = (contractorReference: string) => ({
  queryKey: ['contractor', contractorReference],
  queryFn: () =>
    frontEndApiRequest<Contractor>({
      method: 'get',
      path: `/api/contractors/${contractorReference}`,
    }),
  staleTime: FIVE_MINUTES,
})

export const getContractorRequest = async (
  contractorReference: string
): Promise<ApiResponseType<Contractor | null>> => {
  try {
    const contractor = await queryClient.fetchQuery(
      contractorQuery(contractorReference)
    )

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

export interface ContractorsByTradeParams {
  propertyReference: string
  tradeCode: string
}

export const contractorsByTradeQuery = (params: ContractorsByTradeParams) => ({
  queryKey: ['contractorsByTrade', params],
  queryFn: () =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/contractors',
      params,
    }),
  staleTime: FIVE_MINUTES,
})

export const fetchContractorsByTradeRequest = (
  params: ContractorsByTradeParams
) => queryClient.fetchQuery(contractorsByTradeQuery(params))
