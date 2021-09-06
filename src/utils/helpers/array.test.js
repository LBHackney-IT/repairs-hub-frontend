import { sortArrayByDate } from './array'

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
