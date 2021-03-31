import {
  extractTimeFromDate,
  formatDateTime,
  beginningOfDay,
  beginningOfWeek,
  daysAfter,
  dateEqual,
} from './time'

describe('time', () => {
  describe('extractTimeFromDate', () => {
    it('extracts time from a date', () => {
      const date = new Date(
        'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
      )

      expect(extractTimeFromDate(date)).toEqual('3:46 pm')
    })

    it('extracts time at 12pm from a date', () => {
      const date = new Date(
        'Wed Jan 20 2021 12:46:57 GMT+0000 (Greenwich Mean Time)'
      )

      expect(extractTimeFromDate(date)).toEqual('12:46 pm')
    })

    it('extracts time at 12am from a date', () => {
      const date = new Date(
        'Wed Jan 20 2021 00:46:57 GMT+0000 (Greenwich Mean Time)'
      )

      expect(extractTimeFromDate(date)).toEqual('12:46 am')
    })

    it('extracts time from a date/time passed as a String object', () => {
      const date = '2021-01-20T15:16:57Z'

      expect(extractTimeFromDate(date)).toEqual('3:16 pm')
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

    it('formats 12pm date/time', () => {
      const datetime = new Date('2021-01-20T12:16:57Z')
      expect(formatDateTime(datetime)).toEqual('20 Jan 2021, 12:16 pm')
    })

    it('formats 12am date/time', () => {
      const datetime = '2021-01-20T00:16:57Z'
      expect(formatDateTime(datetime)).toEqual('20 Jan 2021, 12:16 am')
    })
  })

  describe('beginningOfDay', () => {
    it('sets the time to the beginning of the day', () => {
      const date = new Date('2021-02-17T15:16:57Z')
      expect(beginningOfDay(date)).toEqual(new Date('2021-02-17T00:00:00Z'))
    })
  })

  describe('beginningOfWeek', () => {
    describe('when the day is Monday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-15T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })

    describe('when the day is Tuesday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-16T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })

    describe('when the day is Wednesday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-17T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })

    describe('when the day is Thursday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-18T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })

    describe('when the day is Friday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-19T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })

    describe('when the day is Saturday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-20T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })

    describe('when the day is Sunday', () => {
      it('sets the date/time to the beginning of the week', () => {
        const date = new Date('2021-02-21T15:16:57Z')
        expect(beginningOfWeek(date)).toEqual(new Date('2021-02-15T00:00:00Z'))
      })
    })
  })

  describe('daysAfter', () => {
    it('sets the time to the supplied number of days in the future', () => {
      const date = new Date('2021-02-15T15:16:57Z')
      expect(daysAfter(date, 34)).toEqual(new Date('2021-03-21T15:16:57Z'))
    })
  })

  describe('dateEqual', () => {
    describe('when two different date objects are equal in value', () => {
      it('returns true', () => {
        const date = new Date('2021-02-16T15:16:57Z')
        const otherDate = new Date('2021-02-16T15:16:57Z')

        expect(dateEqual(date, otherDate)).toBe(true)
      })
    })

    describe('when two different date objects are not equal in value', () => {
      it('returns true', () => {
        const date = new Date('2021-02-16T15:16:57Z')
        const otherDate = new Date('2021-02-17T15:16:57Z')

        expect(dateEqual(date, otherDate)).toBe(false)
      })
    })
  })
})
