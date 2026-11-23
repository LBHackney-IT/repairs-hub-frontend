import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { PropertyTenureResponse } from '../../models/propertyTenure'
import { CautionaryAlertsResponse } from '../../models/cautionaryAlerts'
import { FIVE_MINUTES, queryClient } from '../queryClient'

export const getPropertyTenureDataRequest = async (
  propertyReference: string
): Promise<ApiResponseType<PropertyTenureResponse>> => {
  try {
    const propertyTenureData: PropertyTenureResponse = await fetchPropertyTenureRequest(
      propertyReference
    )

    return {
      success: true,
      response: propertyTenureData,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Could not find a property with reference ${propertyReference}`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

interface ContactDetails {
  personId: string
  fullName: string
  phoneNumbers: string[]
  tenureType: string
}

export const getContactDetailsRequest = async (
  tenureId: string
): Promise<ApiResponseType<ContactDetails[] | null>> => {
  try {
    const contactDetails = await fetchContactDetailsRequest(tenureId)

    return {
      success: true,
      response: contactDetails,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)
    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Could not find a contact with reference ${tenureId}`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const getAlertsRequest = async (
  propertyReference
): Promise<ApiResponseType<CautionaryAlertsResponse>> => {
  try {
    const alerts = await queryClient.fetchQuery(
      propertyAlertsQuery(propertyReference)
    )

    return {
      success: true,
      response: alerts,
      error: null,
    }
  } catch (e) {
    console.error('Error loading alerts status:', e.response)
    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Error loading alerts status: ${e.response?.status} with message: ${e.response?.data?.message}`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const propertyTenureQuery = (propertyReference: string) => ({
  queryKey: ['property', propertyReference, 'tenure'],
  queryFn: () =>
    frontEndApiRequest<PropertyTenureResponse>({
      method: 'get',
      path: `/api/properties/${propertyReference}`,
    }),
  staleTime: FIVE_MINUTES,
})

export const fetchPropertyTenureRequest = (propertyReference: string) =>
  queryClient.fetchQuery(propertyTenureQuery(propertyReference))

export const legalDisrepairStatusQuery = (propertyReference: string) => ({
  queryKey: ['property', propertyReference, 'legalDisrepair'],
  queryFn: () =>
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/legalDisrepair/${propertyReference}`,
    }),
  staleTime: FIVE_MINUTES,
})

export const fetchLegalDisrepairStatusRequest = (propertyReference: string) =>
  queryClient.fetchQuery(legalDisrepairStatusQuery(propertyReference))

export const propertyAlertsQuery = (propertyReference: string) => ({
  queryKey: ['property', propertyReference, 'alerts'],
  queryFn: () =>
    frontEndApiRequest<CautionaryAlertsResponse>({
      method: 'get',
      path: `/api/properties/${propertyReference}/alerts`,
    }),
  staleTime: FIVE_MINUTES,
})

export interface SearchPropertiesParams {
  searchText: string
  pageSize?: string
  pageNumber?: number
}

export interface UpdateMainContactData {
  contactInformation: {
    contactType: string
    value: string
    description: string
    subType: string
    addressExtended?: unknown
  }
}

export const searchPropertiesQuery = (params: SearchPropertiesParams) => ({
  queryKey: ['propertySearch', params],
  queryFn: () =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/properties/search',
      params,
    }),
  staleTime: FIVE_MINUTES,
})

export const searchPropertiesRequest = (params: SearchPropertiesParams) =>
  queryClient.fetchQuery(searchPropertiesQuery(params))

export const boilerHouseQuery = (boilerHouseId: string) => ({
  queryKey: ['boilerHouse', boilerHouseId],
  queryFn: () =>
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/guid-pk/${boilerHouseId}`,
    }),
  staleTime: FIVE_MINUTES,
})

export const fetchBoilerHouseRequest = (boilerHouseId: string) =>
  queryClient.fetchQuery(boilerHouseQuery(boilerHouseId))

export const fetchContactDetailsRequest = (tenureId: string) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/contact-details/${tenureId}`,
  })

export const updateMainContactRequest = (
  contactId: string,
  personId: string,
  requestData: UpdateMainContactData
) =>
  frontEndApiRequest({
    method: 'PATCH',
    path: `/api/contact-details/?contactId=${contactId}&personId=${personId}`,
    requestData,
  })

export const deleteContactRequest = (contactId: string, personId: string) =>
  frontEndApiRequest({
    method: 'delete',
    path: `/api/contact-details/?contactId=${contactId}&personId=${personId}`,
  })
