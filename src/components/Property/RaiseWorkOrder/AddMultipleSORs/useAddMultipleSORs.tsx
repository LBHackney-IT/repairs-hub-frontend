import { useState } from 'react'

export interface ExtractedSorCode {
  code: string
  quantity: string
  isValid: boolean
}

export const useAddMultipleSORs = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)

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
      isValid: !!code
    }
  }

  const extractSorCodes = (input: string): ExtractedSorCode[] => {
    return input
      .split('\n')
      .map((code) => code.trim().replace(/ {2,}/g, ' '))
      .filter((x) => x)
      .map(extractSorCode)
      .filter(x => x.isValid)
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

  return {
    validationErrors,
    setValidationErrors,
    isLoading,
    setIsLoading,
    extractSorCodes,
    findDuplicateSorCodes,
  }
}
