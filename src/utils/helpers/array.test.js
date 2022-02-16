import { sortArrayByDate, convertValuesOfObjectToArray } from './array'

describe('sortArrayByDate', () => {
  const unsortedArray = [
    { code: '100005', dateAdded: '2021-02-05T09:33:35.757339' },
    { code: '100003', dateAdded: '2021-02-03T09:33:35.757339' },
    { code: '100004', dateAdded: '2021-02-04T09:33:35.757339' },
    { code: '100002', dateAdded: '2021-02-02T09:33:35.757339' },
    { code: '100001', dateAdded: '2021-02-01T09:33:35.757339' },
  ]

  it('returns array sorted by date', () => {
    expect(sortArrayByDate(unsortedArray, 'dateAdded')).toEqual([
      { code: '100005', dateAdded: '2021-02-05T09:33:35.757339' },
      { code: '100004', dateAdded: '2021-02-04T09:33:35.757339' },
      { code: '100003', dateAdded: '2021-02-03T09:33:35.757339' },
      { code: '100002', dateAdded: '2021-02-02T09:33:35.757339' },
      { code: '100001', dateAdded: '2021-02-01T09:33:35.757339' },
    ])
  })
})

describe('convertValuesOfObjectToArray', () => {
  const objectWithStrings = {
    pageNumber: '1',
    IncludeHistorical: false,
    Contractor: 'HO1',
    Priority: 'High',
  }

  it('returns object with values converted to array and skips values that we do not want to convert', () => {
    expect(
      convertValuesOfObjectToArray(objectWithStrings, [
        'pageNumber',
        'IncludeHistorical',
      ])
    ).toEqual({
      pageNumber: '1',
      IncludeHistorical: false,
      Contractor: ['HO1'],
      Priority: ['High'],
    })
  })
})
