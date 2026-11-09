const SOR_CODE_VALID_LENGTH = 8
const SOR_CODE_INVALID_CHARACTER_REGEX = /\s/ // Any whitespace

type SorCodeValidationResults = {
  validCodes: { code: string }[]
  invalidCodes: string[]
}

type SorCodeError = { code: string; message: string }

export class SorCodeValidator {
  currentSorCodes: string[]
  sorCodesToValidate: string[]
  additionalValidationCallback: (
    codes: string[]
  ) => Promise<SorCodeValidationResults> | SorCodeValidationResults | void

  errors: SorCodeError[]
  validatedCodeSet: ({ code: string } | undefined)[]
  duplicateCodes: string[]

  constructor({
    currentSorCodes = [],
    sorCodesToValidate = [],
    additionalValidationCallback = () => {},
  }: {
    currentSorCodes?: string[]
    sorCodesToValidate?: string[]
    additionalValidationCallback?: SorCodeValidator['additionalValidationCallback']
  }) {
    this.currentSorCodes = currentSorCodes
    this.sorCodesToValidate = sorCodesToValidate
    this.additionalValidationCallback = additionalValidationCallback

    this.errors = []
    this.validatedCodeSet = []
    this.duplicateCodes = []
  }

  async validate(): Promise<boolean> {
    this.errors = []
    this.validatedCodeSet = []

    this.sorCodesToValidate.forEach((code) => {
      if (!this.#isValidCode(code)) {
        this.errors.push({ code, message: 'Invalid SOR code format' })
      }
    })

    const validationResults = (await this.additionalValidationCallback(
      this.sorCodesToValidate.filter(
        (code) =>
          // codes which failed format validation aren't validated further
          !this.errors.some((errorObj) => errorObj.code === code)
      )
    )) as SorCodeValidationResults

    validationResults.invalidCodes.forEach((code) => {
      this.errors.push({
        code,
        message: 'SOR code does not exist',
      })
    })

    this.errors.sort(({ code: codeA }, { code: codeB }) => {
      // match the order of the supplied sor codes
      const indexOfCodeA = this.sorCodesToValidate.indexOf(codeA)
      const indexOfCodeB = this.sorCodesToValidate.indexOf(codeB)

      if (indexOfCodeA === indexOfCodeB) {
        return 0
      }

      return indexOfCodeA < indexOfCodeB ? -1 : 1
    })

    if (this.errors.length > 0) {
      return false
    }

    this.validatedCodeSet = this.#deduplicateAndMark(
      this.sorCodesToValidate
    ).map((code) => validationResults.validCodes.find((c) => c.code === code))

    return true
  }

  #isValidCode(code: string): boolean {
    return (
      code.length === SOR_CODE_VALID_LENGTH &&
      !SOR_CODE_INVALID_CHARACTER_REGEX.test(code)
    )
  }

  #deduplicateAndMark(sorCodesToValidate: string[]): string[] {
    return sorCodesToValidate.reduce((deduplicatedCodes: string[], code) => {
      if (
        deduplicatedCodes.includes(code) ||
        this.currentSorCodes.includes(code)
      ) {
        if (!this.duplicateCodes.includes(code)) {
          this.duplicateCodes.push(code)
        }
      } else {
        deduplicatedCodes.push(code)
      }
      return deduplicatedCodes
    }, [])
  }
}
