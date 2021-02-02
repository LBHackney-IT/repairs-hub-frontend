import {
  convertDate,
  dateToStr,
  sortedByDate,
  convertToDateFormat,
  sortedByDateAdded,
} from './date'

describe('date', () => {
  describe('convertDate', () => {
    it('converts string into a date', () => {
      expect(convertDate('2021-01-12T16:24:26.632')).toEqual(
        new Date('2021-01-12T16:24:26.632')
      )
    })
  })

  describe('dateToStr', () => {
    it('converts into human readable date', () => {
      const date = new Date(
        'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
      )

      expect(dateToStr(date)).toEqual('20 Jan 2021')
    })
  })

  describe('sortedByDate', () => {
    it('sorts work orders by date raised', () => {
      const dataToSort = [
        {
          reference: 1234567,
          dateRaised: '2021-01-13T16:24:26.000',
          lastUpdated: '2021-01-20T10:24:26.000',
        },
        {
          reference: 1234568,
          dateRaised: '2021-01-20T16:24:26.000',
          lastUpdated: '2021-01-20T18:24:26.000',
        },
      ]

      expect(sortedByDate(dataToSort)).toEqual([
        {
          reference: 1234568,
          dateRaised: new Date(
            'Wed Jan 20 2021 16:24:26 GMT+0000 (Greenwich Mean Time)'
          ),
          lastUpdated: new Date(
            'Wed Jan 20 2021 18:24:26 GMT+0000 (Greenwich Mean Time)'
          ),
        },
        {
          reference: 1234567,
          dateRaised: new Date(
            'Wed Jan 13 2021 16:24:26 GMT+0000 (Greenwich Mean Time)'
          ),
          lastUpdated: new Date(
            'Wed Jan 20 2021 10:24:26 GMT+0000 (Greenwich Mean Time)'
          ),
        },
      ])
    })
  })

  describe('convertToDateFormat', () => {
    it('creates a date', () => {
      const stringToFormat = {
        date: '2021-01-20',
        time: '12:12:00',
      }

      expect(convertToDateFormat(stringToFormat)).toEqual(
        new Date('2021-01-20T12:12:00.00')
      )
    })
  })

  describe('sortedByDateAdded', () => {
    it('sorts by date added with most recent first', () => {
      const data = [
        {
          dateAdded: '2021-01-20T16:22:26.000',
        },
        {
          dateAdded: '2021-01-20T16:24:26.000',
        },
        {
          dateAdded: '2021-01-20T16:26:26.000',
        },
      ]

      expect(sortedByDateAdded(data)).toEqual([
        {
          dateAdded: new Date(
            'Wed Jan 20 2021 16:26:26 GMT+0000 (Greenwich Mean Time)'
          ),
        },
        {
          dateAdded: new Date(
            'Wed Jan 20 2021 16:24:26 GMT+0000 (Greenwich Mean Time)'
          ),
        },
        {
          dateAdded: new Date(
            'Wed Jan 20 2021 16:22:26 GMT+0000 (Greenwich Mean Time)'
          ),
        },
      ])
    })
  })
})
