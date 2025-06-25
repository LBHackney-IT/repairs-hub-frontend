import {
  convertDate,
  dateToStr,
  sortObjectsByDateKey,
  convertToDateFormat,
  shortDayName,
  shortDate,
  monthDay,
  shortMonthName,
  longMonthName,
  isBeginningOfMonth,
  toISODate,
  longMonthWeekday,
  longDateToStr,
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

  describe('sortObjectsByDateKey', () => {
    it('converts given fields to type date and sorts by the given date key: dateRaised', () => {
      const data = [
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

      expect(
        sortObjectsByDateKey(data, ['dateRaised', 'lastUpdated'], 'dateRaised')
      ).toEqual([
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

    it('converts given fields to type date and sorts by the given date key: dateAdded', () => {
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

      expect(sortObjectsByDateKey(data, ['dateAdded'], 'dateAdded')).toEqual([
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

describe('convertToDateFormat', () => {
  it('creates a date', () => {
    expect(convertToDateFormat('2021-01-20', '12:12:00')).toEqual(
      new Date('2021-01-20T12:12:00.00')
    )
  })
})

describe('shortDayName', () => {
  it('returns Sun for a date which is a Sunday', () => {
    expect(shortDayName(new Date('2021-02-14T00:00:00'))).toEqual('Sun')
  })

  it('returns Mon for a date which is a Monday', () => {
    expect(shortDayName(new Date('2021-02-15T00:00:00'))).toEqual('Mon')
  })

  it('returns Tue for a date which is a Tuesday', () => {
    expect(shortDayName(new Date('2021-02-16T00:00:00'))).toEqual('Tue')
  })

  it('returns Wed for a date which is a Wednesday', () => {
    expect(shortDayName(new Date('2021-02-17T00:00:00'))).toEqual('Wed')
  })

  it('returns Thu for a date which is a Thursday', () => {
    expect(shortDayName(new Date('2021-02-18T00:00:00'))).toEqual('Thu')
  })

  it('returns Fri for a date which is a Friday', () => {
    expect(shortDayName(new Date('2021-02-19T00:00:00'))).toEqual('Fri')
  })

  it('returns Sat for a date which is a Saturday', () => {
    expect(shortDayName(new Date('2021-02-20T00:00:00'))).toEqual('Sat')
  })
})

describe('shortDate', () => {
  it('returns the day and short month name', () => {
    expect(shortDate(new Date('2021-02-15T00:00:00'))).toEqual('15 Feb')
  })
})

describe('monthDay', () => {
  it('returns the month day number', () => {
    expect(monthDay(new Date('2021-02-15T00:00:00'))).toEqual('15')
  })
})

describe('shortMonthName', () => {
  it('returns the short month name', () => {
    expect(shortMonthName(new Date('2021-02-15T00:00:00'))).toEqual('Feb')
  })
})

describe('longMonthName', () => {
  it('returns the month day number', () => {
    expect(longMonthName(new Date('2021-02-15T00:00:00'))).toEqual('February')
  })
})

describe('isBeginningOfMonth', () => {
  it('returns true for the first day of the month', () => {
    expect(isBeginningOfMonth(new Date('2021-02-01T00:00:00'))).toBe(true)
  })

  it('returns false for other days of the month', () => {
    expect(isBeginningOfMonth(new Date('2021-02-15T00:00:00'))).toBe(false)
  })
})

describe('toISODate', () => {
  it('returns the ISO 8601 date string', () => {
    expect(toISODate(new Date('2021-02-15T00:00:00'))).toEqual('2021-02-15')
  })
})

describe('longMonthWeekday', () => {
  it('converts into human readable long Month and Weekday format', () => {
    const date = new Date(
      'Fri Feb 26 2021 00:00:00 GMT+0000 (Greenwich Mean Time)'
    )

    expect(longMonthWeekday(date)).toEqual('Friday 26 February')
  })

  it('does not separate the date with a comma if the option is supplied', () => {
    const date = new Date(
      'Fri Feb 26 2021 00:00:00 GMT+0000 (Greenwich Mean Time)'
    )

    expect(longMonthWeekday(date, { commaSeparated: false })).toEqual(
      'Friday 26 February'
    )
  })
})

describe('longDateToStr', () => {
  it('converts into human readable date', () => {
    const date = new Date(
      'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
    )

    // Even with locale, the comma can be inconsistent
    var options = ['Wednesday 20 January 2021', 'Wednesday, 20 January 2021']
    expect(options).toContain(longDateToStr(date))
  })
})
