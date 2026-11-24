import SorCode from '@/models/sorCode'

const SOR_CODE_VALID_LENGTH = 8
const SOR_CODE_INVALID_CHARACTER_REGEX = /\s/ // Any whitespace

export type ValidatedSorCode = Pick<
  SorCode,
  'code' | 'cost' | 'shortDescription'
> & { code: string }

export type SorCodeValidationResults = {
  allCodesValid?: boolean
  validCodes: ValidatedSorCode[]
  invalidCodes: string[]
}

export type SorCodeValidationCallback = (
  codes: string[]
) => Promise<SorCodeValidationResults> | SorCodeValidationResults

export type SorCodeError = { code: string; message: string }

type SorCodeValidatorOptions = {
  currentSorCodes?: string[]
  sorCodesToValidate?: string[]
  additionalValidationCallback?: SorCodeValidationCallback
  preserveDuplicates?: boolean
}

export class SorCodeValidator {
  currentSorCodes: string[]
  sorCodesToValidate: string[]
  additionalValidationCallback: SorCodeValidationCallback

  errors: SorCodeError[]
  validatedCodeSet: ValidatedSorCode[]
  duplicateCodes: string[]
  preserveDuplicates: boolean

  constructor({
    currentSorCodes = [],
    sorCodesToValidate = [],
    additionalValidationCallback = () => ({
      validCodes: [],
      invalidCodes: [],
    }),
    preserveDuplicates = false,
  }: SorCodeValidatorOptions) {
    this.currentSorCodes = currentSorCodes
    this.sorCodesToValidate = sorCodesToValidate
    this.additionalValidationCallback = additionalValidationCallback
    this.preserveDuplicates = preserveDuplicates

    this.errors = []
    this.validatedCodeSet = []
    this.duplicateCodes = []
  }

  async validate(): Promise<boolean> {
    this.errors = []
    this.validatedCodeSet = []

    const codesWithValidFormat = this.sorCodesToValidate.filter((code) =>
      this.#isValidCode(code)
    )

    this.errors = this.sorCodesToValidate
      .filter((code) => !this.#isValidCode(code))
      .map((code) => ({ code, message: 'Invalid SOR code format' }))

    // codes which failed format validation aren't validated further
    const validationResults = await this.additionalValidationCallback(
      codesWithValidFormat
    )

    validationResults.invalidCodes.forEach((code) => {
      this.errors.push({ code, message: 'SOR code does not exist' })
    })

    // match the order of the supplied sor codes
    this.errors.sort(
      (a, b) =>
        this.sorCodesToValidate.indexOf(a.code) -
        this.sorCodesToValidate.indexOf(b.code)
    )

    if (this.errors.length > 0) {
      return false
    }

    this.duplicateCodes = []

    const codes = this.preserveDuplicates
      ? this.sorCodesToValidate
      : this.#deduplicateAndMark(this.sorCodesToValidate)

    this.validatedCodeSet = codes
      .map((code) => validationResults.validCodes.find((c) => c.code === code))
      .filter((sorCode): sorCode is ValidatedSorCode => sorCode !== undefined)

    return true
  }

  #isValidCode(code: string): boolean {
    return (
      code.length === SOR_CODE_VALID_LENGTH &&
      !SOR_CODE_INVALID_CHARACTER_REGEX.test(code)
    )
  }

  #deduplicateAndMark(sorCodesToValidate: string[]): string[] {
    const uniqueCodes: string[] = []

    sorCodesToValidate.forEach((code) => {
      const isDuplicate =
        uniqueCodes.includes(code) || this.currentSorCodes.includes(code)

      if (!isDuplicate) {
        uniqueCodes.push(code)
      } else if (!this.duplicateCodes.includes(code)) {
        this.duplicateCodes.push(code)
      }
    })

    return uniqueCodes
  }
}
