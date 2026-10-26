const DEFAULT_QUANTITY = '1'
const SOR_CODE_VALID_LENGTH = 8
const QUANTITY_REGEX = /^\d+$/

export interface ParsedSorCodeLine {
  lineNumber: number
  text: string
  code: string
  quantity: string
}

export interface SorCodeLineError {
  lineNumber: number
  // every line the error applies to (e.g. all the lines of a duplicated code)
  lineNumbers: number[]
  text: string
  message: string
}

interface Options {
  currentSorCodes?: string[]
}

const joinLineNumbers = (lineNumbers: number[]) =>
  lineNumbers.length === 1
    ? `Line ${lineNumbers[0]}`
    : `Lines ${lineNumbers.slice(0, -1).join(', ')} and ${
        lineNumbers[lineNumbers.length - 1]
      }`

export const describeLineNumbers = joinLineNumbers

// Parses pasted lines in the form "CODE" or "CODE QUANTITY" (any whitespace separator).
// Nothing is corrected or merged; anything ambiguous is reported as an error.
// Duplicate codes are reported first (one error per duplicated code), then the
// problems with individual lines. A line can appear in both.
export const parseSorCodeLines = (
  input: string,
  { currentSorCodes = [] }: Options = {}
) => {
  const duplicateErrors: SorCodeLineError[] = []
  const lineErrors: SorCodeLineError[] = []
  const candidates: ParsedSorCodeLine[] = []
  const lineNumbersByCode: { [code: string]: number[] } = {}

  input.split('\n').forEach((rawLine, index) => {
    const text = rawLine.trim()
    if (!text) return

    const lineNumber = index + 1
    const tokens = text.split(/\s+/)
    const [code, quantityToken] = tokens

    if (code.length === SOR_CODE_VALID_LENGTH) {
      lineNumbersByCode[code] = [...(lineNumbersByCode[code] || []), lineNumber]
    }

    const fail = (message: string) =>
      lineErrors.push({ lineNumber, lineNumbers: [lineNumber], text, message })

    if (tokens.length > 2) {
      return fail('Enter one SOR code, optionally followed by a quantity')
    }

    if (code.length !== SOR_CODE_VALID_LENGTH) {
      return fail('Invalid SOR code format')
    }

    if (quantityToken !== undefined) {
      if (!QUANTITY_REGEX.test(quantityToken)) {
        return fail('Quantity must be a whole number')
      }

      if (parseInt(quantityToken, 10) <= 0) {
        return fail('Quantity must be greater than 0')
      }
    }

    if (currentSorCodes.includes(code)) {
      return fail('SOR code has already been added to the form')
    }

    candidates.push({
      lineNumber,
      text,
      code,
      quantity:
        quantityToken === undefined
          ? DEFAULT_QUANTITY
          : String(parseInt(quantityToken, 10)),
    })
  })

  Object.entries(lineNumbersByCode).forEach(([code, lineNumbers]) => {
    if (lineNumbers.length > 1) {
      duplicateErrors.push({
        lineNumber: lineNumbers[0],
        lineNumbers,
        text: code,
        message: 'Duplicate SOR code',
      })
    }
  })

  const duplicateLineNumbers = duplicateErrors.flatMap((e) => e.lineNumbers)

  const byFirstLine = (a: SorCodeLineError, b: SorCodeLineError) =>
    a.lineNumber - b.lineNumber

  return {
    lines: candidates.filter(
      (line) => !duplicateLineNumbers.includes(line.lineNumber)
    ),
    errors: [
      ...duplicateErrors.sort(byFirstLine),
      ...lineErrors.sort(byFirstLine),
    ],
  }
}
