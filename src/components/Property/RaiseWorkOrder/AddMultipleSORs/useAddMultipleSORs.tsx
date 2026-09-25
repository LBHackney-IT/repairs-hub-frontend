import { useState } from 'react'
import { SorCodeWithQuantity } from './AddMultipleSORs'
import SorCode from '@/root/src/models/sorCode'

export interface ExtractedSorCode {
  code: string
  quantity: string
  isValid: boolean
}

export const useAddMultipleSORs = (
  sorExistenceValidationCallback: (
    sorCodes: string[]
  ) => Promise<{
    allCodesValid: boolean
    validCodes: SorCode[]
    invalidCodes: SorCode[]
  }>
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const extractSorCode = (line: string): ExtractedSorCode => {
    const re = /^([A-Za-z0-9]{4,12})(?: (\d+))?$/

    const [, code, num] = line.match(re) ?? []

    let quantity = num ?? '1'

    // I dont see a reason to throw an error here.
    // Why would anyone intentionally pick zero
    if (quantity === '0') quantity = '1'

    return {
      code: code ?? null,
      quantity,
      isValid: !!code,
    }
  }

  const extractSorCodes = (input: string) => {
    const lines = input
      .split('\n')
      .map((line) => line.trim().replace(/ {2,}/g, ' '))
      .filter((x) => x)

    const valid: ExtractedSorCode[] = []
    const malformed: string[] = []

    lines.forEach((line) => {
      const result = extractSorCode(line)
      result.isValid ? valid.push(result) : malformed.push(line)
    })

    return { valid, malformed }
  }

  const findDuplicateSorCodes = (sorCodes: ExtractedSorCode[]): string[] => {
    const visitedCodes = new Set<string>()

    return sorCodes
      .map((x) => x.code)
      .filter((x) => {
        if (!visitedCodes.has(x)) {
          visitedCodes.add(x)
          return false
        }

        return true
      })
  }

  const parseAndValidateCodes = async (
    textInput: string
  ): Promise<SorCodeWithQuantity[] | null> => {
    setValidationError(null)

    const extractedSorCodeData = extractSorCodes(textInput)

    if (extractedSorCodeData.malformed.length >= 1) {
      setValidationError(
        `The following lines arent in the expected format: ${extractedSorCodeData.malformed.join(
          ', '
        )}`
      )
      return null
    }

    if (extractedSorCodeData.valid.length === 0) {
      setValidationError("You haven't included any codes")
      return null
    }

    const sorCodes = extractedSorCodeData.valid

    const duplicateCodes = findDuplicateSorCodes(sorCodes)
    if (duplicateCodes.length >= 1) {
      setValidationError(
        `Duplicate SOR codes found: ${duplicateCodes.join(', ')}`
      )
      return null
    }

    // doesnt actually load unless a request is made
    setIsLoading(true)

    try {
      // Makes a request to confirm that the SOR codes are valid
      // and that they are valid for the contract
      const validationResult = await sorExistenceValidationCallback(
        sorCodes.map((x) => x.code)
      )

      if (validationResult?.invalidCodes.length >= 1) {
        setValidationError(
          `The following codes are invalid: ${validationResult?.invalidCodes.join(
            ', '
          )}`
        )
        return null
      }

      const sorCodeQuantity: { [key: string]: string } = {}
      sorCodes.forEach((x) => {
        sorCodeQuantity[x.code] = x.quantity
      })

      return validationResult.validCodes.map((x) => ({
        ...x,
        quantity: sorCodeQuantity[x.code],
      }))
    } catch (e) {
      console.error('somethign went wrong', e)
      setValidationError('Something went wrong')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    validationError,
    isLoading,
    parseAndValidateCodes,
  }
}
