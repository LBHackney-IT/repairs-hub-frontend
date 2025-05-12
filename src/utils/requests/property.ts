import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { Tenure } from '../../models/tenure'

export const getTenureId = async (
  workOrderPropertyReference: string
): Promise<ApiResponseType<Tenure["id"] | null>> => {
  try {
    const propertyData = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${workOrderPropertyReference}`,
      })

    return {
      success: true,
      response: propertyData.tenure.id,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Could not find a tenure id with reference ${workOrderPropertyReference}`
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
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
      console.log('Contact details:', contactDetails)
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
                    : `Oops, an error occurred: ${
                        e.response?.status
                    } with message: ${JSON.stringify(e.response?.data?.message)}`
            ),
        }
    }
}