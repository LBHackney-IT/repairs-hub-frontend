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

export const describeLineNumbers = (lineNumbers: number[]) =>
  lineNumbers.length === 1
    ? `Line ${lineNumbers[0]}`
    : `Lines ${lineNumbers.slice(0, -1).join(', ')} and ${
        lineNumbers[lineNumbers.length - 1]
      }`

// Parses and validates a single, non-blank line, returning either the parsed
// line or an error. The sorCode is returned either way so duplicates can be
// found across lines, which is checked elsewhere.
const parseAndValidateLine = (
  text: string,
  lineNumber: number
):
  | {
      sorCode: string
      line: ParsedSorCodeLine
    }
  | {
      sorCode: string
      error: string
    } => {
  // 1. A line is a SOR code, optionally followed by a quantity. Anything else is invalid
  const [sorCode, quantityToken, ...extraTokens] = text.split(/\s+/)

  if (extraTokens.length > 0) {
    return {
      sorCode,
      error: 'Enter one SOR code, optionally followed by a quantity',
    }
  }

  // 2. Test the SOR code is the right length
  if (sorCode.length !== SOR_CODE_VALID_LENGTH) {
    return { sorCode, error: 'Invalid SOR code format' }
  }

  // 3. If a quantity was given, test it is a whole number greater than 0
  if (quantityToken !== undefined) {
    if (!QUANTITY_REGEX.test(quantityToken)) {
      return { sorCode, error: 'Quantity must be a whole number' }
    }

    if (parseInt(quantityToken, 10) <= 0) {
      return { sorCode, error: 'Quantity must be greater than 0' }
    }
  }

  // 4. The line is valid, the quantity defaults to 1 if not given
  return {
    sorCode,
    line: {
      lineNumber,
      text,
      code: sorCode,
      quantity:
        quantityToken === undefined
          ? DEFAULT_QUANTITY
          : String(parseInt(quantityToken, 10)),
    },
  }
}

// Parses pasted lines of SOR codes with optional quantities.
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
    // 1. Ignore blank lines
    const text = rawLine.trim()
    if (!text) return

    const lineNumber = index + 1
    const addLineError = (message: string) =>
      lineErrors.push({ lineNumber, lineNumbers: [lineNumber], text, message })

    // 2. Parse and validate the line on its own
    const parsed = parseAndValidateLine(text, lineNumber)

    // 3. Note where each SOR code appears, to find duplicates once every line is read
    if (parsed.sorCode.length === SOR_CODE_VALID_LENGTH) {
      lineNumbersByCode[parsed.sorCode] = [
        ...(lineNumbersByCode[parsed.sorCode] || []),
        lineNumber,
      ]
    }

    // 4. Keep the line if it is valid, otherwise record why it isn't,
    //    including when its SOR code is already on the form
    if ('error' in parsed) {
      addLineError(parsed.error)
    } else if (currentSorCodes.includes(parsed.sorCode)) {
      addLineError('SOR code has already been added to the form')
    } else {
      candidates.push(parsed.line)
    }
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
