import axios, { Method } from 'axios'
import { paramsSerializer } from '@/utils/urls'

interface FrontendApiRequestProps {
  method: Method
  path: string
  params?: { [key: string]: string | number; }
  requestData?: string
  paramsSerializer?: (params: any) => string
}



export const frontEndApiRequest = async <T = any,>({
  method,
  path,
  params,
  requestData,
  paramsSerializer,
}: FrontendApiRequestProps) : Promise<T> => {
  const { data } = await axios({
    method: method,
    url: path,
    params: params,
    ...(requestData && { data: requestData }),
    ...(paramsSerializer && { paramsSerializer }),
  })

  return data
}

export const fetchFeatureToggles = async () => {
  try {
    const configurationData = await frontEndApiRequest({
      method: 'GET',
      path: '/api/toggles',
    })

    return configurationData?.[0]?.featureToggles || {}
  } catch (e) {
    console.error(
      `Error fetching toggles from configuration API: ${JSON.stringify(e)}`
    )

    return {}
  }
}

export const createSorExistenceValidator = (
  tradeCode,
  propertyRef,
  contractorRef,
  isRaisable
) => {
  return async (codesForValidation) => {
    const validationResults = {
      allCodesValid: false,
      validCodes: [],
      invalidCodes: [],
    }

    if (codesForValidation.length === 0) {
      return { ...validationResults, allCodesValid: true }
    }

    try {
      const sorCodes = await frontEndApiRequest({
        method: 'get',
        path: '/api/schedule-of-rates/check',
        params: {
          tradeCode: tradeCode,
          propertyReference: propertyRef,
          contractorReference: contractorRef,
          sorCode: codesForValidation,
          isRaisable: isRaisable,
        },
        ...(paramsSerializer && { paramsSerializer }),
      })

      validationResults.validCodes = sorCodes.filter((sorCodeObj) =>
        codesForValidation.includes(sorCodeObj.code)
      )

      const validCodes = validationResults.validCodes.map(
        (sorCodeObj) => sorCodeObj.code
      )

      validationResults.invalidCodes = codesForValidation.filter(
        (code) => !validCodes.includes(code)
      )

      if (validationResults.validCodes.length === codesForValidation.length) {
        validationResults.allCodesValid = true
      }

      return validationResults
    } catch (e) {
      throw new Error(
        `Cannot fetch SOR codes for validation: ${JSON.stringify(e)}`
      )
    }
  }
}
