import { checkSorCodesRequest } from '@/requests/scheduleOfRates'
import { paramsSerializer } from '@/utils/urls'
import { SorCodeValidationCallback } from './SorCodeValidator'

export const createSorExistenceValidator = (
  tradeCode: string,
  propertyRef: string,
  contractorRef: string,
  isRaisable: boolean
): SorCodeValidationCallback => {
  return async (codesForValidation: string[]) => {
    if (codesForValidation.length === 0) {
      return { allCodesValid: true, validCodes: [], invalidCodes: [] }
    }

    try {
      const sorCodes = await checkSorCodesRequest(
        {
          tradeCode,
          propertyReference: propertyRef,
          contractorReference: contractorRef,
          sorCode: codesForValidation,
          isRaisable,
        },
        paramsSerializer
      )

      const validCodes = sorCodes.filter((sorCodeObj) =>
        codesForValidation.includes(sorCodeObj.code)
      )
      const validCodeNames = validCodes.map((sorCodeObj) => sorCodeObj.code)

      return {
        allCodesValid: validCodes.length === codesForValidation.length,
        validCodes,
        invalidCodes: codesForValidation.filter(
          (code) => !validCodeNames.includes(code)
        ),
      }
    } catch (e) {
      throw new Error(
        `Cannot fetch SOR codes for validation: ${JSON.stringify(e)}`,
        { cause: e }
      )
    }
  }
}
