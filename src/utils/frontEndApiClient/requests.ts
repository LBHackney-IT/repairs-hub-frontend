import axios, { AxiosRequestConfig, Method } from 'axios'
import { paramsSerializer } from '@/utils/urls'
import { SimpleFeatureToggleResponse } from '../../pages/api/simple-feature-toggle'

export const frontEndApiRequest = async ({
  method,
  path,
  params = null,
  requestData,
  paramsSerializer,
  timeout,
}: {
  method: Method
  path: string
  params?: object
  requestData?: object
  paramsSerializer?: any
  timeout?: number
}) => {
  const config: AxiosRequestConfig = {
    method: method,
    url: path,
    timeout,
    ...(requestData && { data: requestData }),
    ...(paramsSerializer && { paramsSerializer }),
  }

  if (params) {
    config.params = params
  }

  const { data } = await axios(config)

  return data
}

export const fetchSimpleFeatureToggles: () => Promise<SimpleFeatureToggleResponse> =
  async () => {
    const featureToggleData = await frontEndApiRequest({
      method: 'get',
      path: '/api/simple-feature-toggle',
    })

    return featureToggleData
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
