import axios from 'axios'

export const frontEndApiRequest = async ({
  method,
  path,
  params,
  requestData,
  paramsSerializer,
}) => {
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
  contractorRef
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
        path: '/api/schedule-of-rates/codes',
        params: {
          tradeCode: tradeCode,
          propertyReference: propertyRef,
          contractorReference: contractorRef,
          isRaisable: true,
        },
      })

      codesForValidation.forEach((code) => {
        if (sorCodes.some((sorCodeObj) => sorCodeObj.code === code)) {
          validationResults.validCodes.push(code)
        } else {
          validationResults.invalidCodes.push(code)
        }
      })

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
