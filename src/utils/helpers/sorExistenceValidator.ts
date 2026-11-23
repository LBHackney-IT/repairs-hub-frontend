import { checkSorCodesRequest } from '@/requests/scheduleOfRates'
import { paramsSerializer } from '@/utils/urls'

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
      const sorCodes = await checkSorCodesRequest(
        {
          tradeCode: tradeCode,
          propertyReference: propertyRef,
          contractorReference: contractorRef,
          sorCode: codesForValidation,
          isRaisable: isRaisable,
        },
        paramsSerializer
      )

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
        `Cannot fetch SOR codes for validation: ${JSON.stringify(e)}`,
        { cause: e }
      )
    }
  }
}
