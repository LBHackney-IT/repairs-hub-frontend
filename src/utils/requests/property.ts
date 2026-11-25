import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { PropertyTenureResponse } from '../../models/propertyTenure'
import { CautionaryAlertsResponse } from '../../models/cautionaryAlerts'

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
    const alerts = await frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/alerts`,
    })

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

export const fetchPropertyTenureRequest = (propertyReference: string) =>
  frontEndApiRequest<PropertyTenureResponse>({
    method: 'get',
    path: `/api/properties/${propertyReference}`,
  })

export const getLegalDisrepairStatusRequest = async (
  propertyReference: string
): Promise<ApiResponseType<{ propertyIsInLegalDisrepair: boolean }>> => {
  try {
    const status = await frontEndApiRequest<{
      propertyIsInLegalDisrepair: boolean
    }>({
      method: 'get',
      path: `/api/properties/legalDisrepair/${propertyReference}`,
    })

    return { success: true, response: status, error: null }
  } catch (e) {
    console.error('Error loading legal disrepair status:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        `Error loading legal disrepair status: ${e.response?.status} with message: ${e.response?.data?.message}`
      ),
    }
  }
}

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

export const searchPropertiesRequest = (params: SearchPropertiesParams) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/properties/search',
    params,
  })

export const fetchBoilerHouseRequest = (boilerHouseId: string) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/properties/guid-pk/${boilerHouseId}`,
  })

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
