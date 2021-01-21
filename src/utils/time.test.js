import { extractTimeFromDate } from './time'

describe('time', () => {
  describe('extractTimeFromDate', () => {
    it('extracts time from a date', () => {
      const date = new Date(
        'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
      )

      expect(extractTimeFromDate(date)).toEqual('3:46 pm')
    })
  })
})
