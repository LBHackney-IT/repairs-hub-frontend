import { parseSorCodeLines } from './parseSorCodeLines'

describe('parseSorCodeLines', () => {
  it('defaults quantity to 1 and ignores blank lines', () => {
    expect(parseSorCodeLines('04500910\n\n  49PLMAT2  \n')).toEqual({
      lines: [
        { lineNumber: 1, text: '04500910', code: '04500910', quantity: '1' },
        { lineNumber: 3, text: '49PLMAT2', code: '49PLMAT2', quantity: '1' },
      ],
      errors: [],
    })
  })

  it('reads the quantity separated by spaces or tabs', () => {
    const { lines, errors } = parseSorCodeLines(
      '04500910 3\n49PLMAT2\t\t15\nRTR03016   7'
    )

    expect(errors).toEqual([])
    expect(lines.map((l) => [l.code, l.quantity])).toEqual([
      ['04500910', '3'],
      ['49PLMAT2', '15'],
      ['RTR03016', '7'],
    ])
  })

  it.each([
    ['04500910 abc', 'Quantity must be a whole number'],
    ['04500910 -1', 'Quantity must be a whole number'],
    ['04500910 1.234', 'Quantity must be a whole number'],
    ['04500910 1.5', 'Quantity must be a whole number'],
    ['04500910 0', 'Quantity must be greater than 0'],
    ['04500910 1 2', 'Enter one SOR code, optionally followed by a quantity'],
    ['0450091', 'Invalid SOR code format'],
  ])('reports an error for "%s"', (input, message) => {
    const { lines, errors } = parseSorCodeLines(input)

    expect(lines).toEqual([])
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toContain(message)
  })

  it('reports each duplicated code once, listing every line it appears on', () => {
    const { lines, errors } = parseSorCodeLines(
      '04500910 3\n49PLMAT2\n04500910 2\n04500910'
    )

    expect(lines.map((l) => l.code)).toEqual(['49PLMAT2'])
    expect(errors).toEqual([
      {
        lineNumber: 1,
        lineNumbers: [1, 3, 4],
        text: '04500910',
        message: 'Duplicate SOR code',
      },
    ])
  })

  it('reports duplicates first, then the errors on individual lines, including lines that are both', () => {
    const { lines, errors } = parseSorCodeLines(
      [
        '21000006',
        '20060040',
        '20060190',
        '',
        '21000006 22',
        '20060040 r2',
        '20060190 22233 3323',
      ].join('\n')
    )

    expect(lines).toEqual([])
    expect(errors.map((e) => [e.lineNumbers, e.text, e.message])).toEqual([
      [[1, 5], '21000006', 'Duplicate SOR code'],
      [[2, 6], '20060040', 'Duplicate SOR code'],
      [[3, 7], '20060190', 'Duplicate SOR code'],
      [[6], '20060040 r2', 'Quantity must be a whole number'],
      [
        [7],
        '20060190 22233 3323',
        'Enter one SOR code, optionally followed by a quantity',
      ],
    ])
  })

  it('reports codes already on the form', () => {
    const { errors } = parseSorCodeLines('04500910', {
      currentSorCodes: ['04500910'],
    })

    expect(errors[0].message).toEqual(
      'SOR code has already been added to the form'
    )
  })
})
