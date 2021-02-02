import { extractTimeFromDate, formatDateTime } from './time'

describe('time', () => {
  describe('extractTimeFromDate', () => {
    it('extracts time from a date', () => {
      const date = new Date(
        'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
      )

      expect(extractTimeFromDate(date)).toEqual('3:46 pm')
    })
  })

  describe('formatDateTime', () => {
    it('formats date/time passed as a Date object', () => {
      const datetime = new Date('2021-01-20T15:16:57Z')
      expect(formatDateTime(datetime)).toEqual('20 Jan 2021, 3:16 pm')
    })

    it('formats date/time passed as a String object', () => {
      const datetime = '2021-01-20T15:16:57Z'
      expect(formatDateTime(datetime)).toEqual('20 Jan 2021, 3:16 pm')
    })
  })
})
