import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { PropertyTenureResponse } from '../../models/propertyTenure'
import { CautionaryAlertsResponse } from '../../models/cautionaryAlerts'

export const getPropertyTenureData = async (
  propertyReference: string
): Promise<ApiResponseType<PropertyTenureResponse>> => {
  try {
    const propertyTenureData: PropertyTenureResponse = await frontEndApiRequest(
      {
        method: 'get',
        path: `/api/properties/${propertyReference}`,
      }
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

export const getContactDetails = async (
  tenureId: string
): Promise<ApiResponseType<ContactDetails[] | null>> => {
  try {
    const contactDetails = await frontEndApiRequest({
      method: 'get',
      path: `/api/contact-details/${tenureId}`,
    })

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

export const getAlerts = async (
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
