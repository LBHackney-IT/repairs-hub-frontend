import {
  calculateCompletionDateTime,
  isCurrentTimeOperativeOvertime,
  isCurrentTimeOutOfHours,
  isOperativeOverTime,
} from './completionDateTimes'
import MockDate from 'mockdate'
import { addHours } from 'date-fns'

const mockBankHolidays = jest.fn()

jest.mock('./bankHolidays', () => ({
  get bankHolidays() {
    return mockBankHolidays()
  },
}))

const mockLowPriorityHolidays = jest.fn()

jest.mock('./lowPriorityHolidays', () => ({
  get lowPriorityHolidays() {
    return mockLowPriorityHolidays()
  },
}))

describe('calculateCompletionDateTime', () => {
  beforeEach(() => {
    mockBankHolidays.mockReturnValue({
      'england-and-wales': {
        events: [],
      },
    })

    mockLowPriorityHolidays.mockReturnValue([])
  })

  describe('when there are no upcoming holidays', () => {
    describe('when today is a working day', () => {
      const dateTime = new Date('Monday 28 June 2021 17:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('adds the supplied numbers of working days or hours to calculate completion time', () => {
        expect(
          calculateCompletionDateTime({ workingDays: 0, workingHours: 2 })
        ).toEqual(addHours(dateTime, 2))

        expect(calculateCompletionDateTime({ workingDays: 1 })).toEqual(
          new Date('Tuesday 29 June 2021 17:00:00Z')
        )

        expect(calculateCompletionDateTime({ workingDays: 5 })).toEqual(
          new Date('Monday 5 July 2021 17:00:00Z')
        )

        expect(calculateCompletionDateTime({ workingDays: 21 })).toEqual(
          new Date('Tuesday 27 July 2021 17:00:00Z')
        )
      })
    })

    describe('when today is a Saturday (non-working day)', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('adds the supplied number of working days or hours to calculate completion time', () => {
        expect(
          calculateCompletionDateTime({ workingDays: 0, workingHours: 2 })
        ).toEqual(addHours(dateTime, 2))

        // Work orders with multi day targets raised on a Saturday are calculated as if they were raised on the most recent working day (i.e. Friday)

        expect(calculateCompletionDateTime({ workingDays: 1 })).toEqual(
          new Date('Monday 28 June 2021 09:00:00Z')
        )

        expect(calculateCompletionDateTime({ workingDays: 5 })).toEqual(
          new Date('Friday 2 July 2021 09:00:00Z')
        )

        expect(calculateCompletionDateTime({ workingDays: 10 })).toEqual(
          new Date('Friday 9 July 2021 09:00:00Z')
        )

        expect(calculateCompletionDateTime({ workingDays: 21 })).toEqual(
          new Date('Monday 26 July 2021 09:00:00Z')
        )
      })
    })
  })

  describe('when there are upcoming bank holidays', () => {
    const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

    beforeEach(() => {
      MockDate.set(dateTime)

      mockBankHolidays.mockReturnValue({
        'england-and-wales': {
          division: 'england-and-wales',
          events: [
            {
              title: 'Fake bank holiday',
              date: '2021-06-28', // the following Monday
              notes: '',
              bunting: true,
            },
          ],
        },
      })
    })

    afterEach(() => {
      MockDate.reset()
    })

    it('adds the supplied number of working days or hours to calculate completion time', () => {
      // Work orders with multi day targets raised on a Saturday are calculated as if they were raised on the most recent working day (i.e. Friday)

      expect(calculateCompletionDateTime({ workingDays: 1 })).toEqual(
        new Date('Tuesday 29 June 2021 09:00:00Z')
      )

      expect(calculateCompletionDateTime({ workingDays: 5 })).toEqual(
        new Date('Monday 5 July 2021 09:00:00Z')
      )

      expect(calculateCompletionDateTime({ workingDays: 21 })).toEqual(
        new Date('Tuesday 27 July 2021 09:00:00Z')
      )
    })
  })

  describe('when there are imminent low priority holidays', () => {
    const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

    beforeEach(() => {
      MockDate.set(dateTime)

      mockLowPriorityHolidays.mockReturnValue(['2021-06-28', '2021-07-26'])
    })

    afterEach(() => {
      MockDate.reset()
    })

    it('adds the supplied number of working days or hours to calculate completion time', () => {
      // Work orders with multi day targets raised on a Saturday are calculated as if they were raised on the most recent working day (i.e. Friday)

      expect(
        calculateCompletionDateTime({ workingDays: 1, lowPriority: false })
      ).toEqual(new Date('Monday 28 June 2021 09:00:00Z'))

      expect(
        calculateCompletionDateTime({ workingDays: 1, lowPriority: true })
      ).toEqual(new Date('Tuesday 29 June 2021 09:00:00Z'))

      expect(
        calculateCompletionDateTime({ workingDays: 5, lowPriority: true })
      ).toEqual(new Date('Monday 5 July 2021 09:00:00Z'))

      // 21 working days into the future, as if the order had been raised on Friday and with the 2 low priority holidays accounted for
      expect(
        calculateCompletionDateTime({ workingDays: 21, lowPriority: true })
      ).toEqual(new Date('Wednesday 28 July 2021 09:00:00Z'))
    })
  })

  describe('when it is a working day near the end of a year', () => {
    // This fictional scenario includes NO bank holidays and instead focuses on getting dates around the year boundary correct

    const dateTime = new Date('Wednesday 29 December 2021 12:00:00Z')

    beforeEach(() => {
      MockDate.set(dateTime)
    })

    afterEach(() => {
      MockDate.reset()
    })

    it('adds the supplied number of working days or hours to calculate completion time', () => {
      expect(calculateCompletionDateTime({ workingDays: 5 })).toEqual(
        new Date('Wednesday 5 January 2022 12:00:00Z')
      )

      expect(calculateCompletionDateTime({ workingDays: 21 })).toEqual(
        new Date('Thursday 27 January 2022 12:00:00Z')
      )
    })
  })
})

describe('isCurrentTimeOutOfHours', () => {
  beforeEach(() => {
    mockBankHolidays.mockReturnValue({
      'england-and-wales': {
        division: 'england-and-wales',
        events: [],
      },
    })
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('when today is a bank holiday', () => {
    beforeEach(() => {
      const dateTime = new Date('Thursday 16 September 2021 09:00:00Z')
      MockDate.set(dateTime)

      mockBankHolidays.mockReturnValue({
        'england-and-wales': {
          division: 'england-and-wales',
          events: [
            {
              title: 'Fake bank holiday',
              date: '2021-09-16',
            },
          ],
        },
      })
    })

    it('returns true', () => {
      expect(isCurrentTimeOutOfHours()).toEqual(true)
    })
  })

  describe('when today is a weekend day', () => {
    beforeEach(() => {
      const dateTime = new Date('Saturday 18 September 2021 09:00:00')

      MockDate.set(dateTime)
    })

    it('returns true', () => {
      expect(isCurrentTimeOutOfHours()).toEqual(true)
    })
  })

  describe('when today is a working day', () => {
    describe('and current time is before 0800', () => {
      beforeEach(() => {
        const dateTime = new Date('Thursday 16 September 2021 07:59:00')

        MockDate.set(dateTime)
      })

      it('returns true', () => {
        expect(isCurrentTimeOutOfHours()).toEqual(true)
      })
    })

    describe('and current time is after 1800', () => {
      beforeEach(() => {
        const dateTime = new Date('Thursday 16 September 2021 18:01:00')

        MockDate.set(dateTime)
      })

      it('returns true', () => {
        expect(isCurrentTimeOutOfHours()).toEqual(true)
      })
    })

    describe('and current time is just after 0800', () => {
      beforeEach(() => {
        const dateTime = new Date('Thursday 16 September 2021 08:01:00')

        MockDate.set(dateTime)
      })

      it('returns false', () => {
        expect(isCurrentTimeOutOfHours()).toEqual(false)
      })
    })

    describe('and current time is just before 1800', () => {
      beforeEach(() => {
        const dateTime = new Date('Thursday 16 September 2021 17:59:00')

        MockDate.set(dateTime)
      })

      it('returns false', () => {
        expect(isCurrentTimeOutOfHours()).toEqual(false)
      })
    })
  })
})

describe('isCurrentTimeOperativeOvertime', () => {
  beforeEach(() => {
    mockBankHolidays.mockReturnValue({
      'england-and-wales': {
        events: [],
      },
    })
  })
  describe('when it is a working day', () => {
    const dateTime = new Date('Thursday 9 December 2021')

    afterEach(() => {
      MockDate.reset()
    })

    describe('and the time is before 8am', () => {
      beforeEach(() => {
        MockDate.set(dateTime.setHours(7, 59, 0))
      })

      it('returns true', () => {
        expect(isCurrentTimeOperativeOvertime()).toEqual(true)
      })
    })

    describe('and the time is between 8am and 4pm', () => {
      beforeEach(() => {
        MockDate.set(dateTime.setHours(12, 0, 0))
      })

      it('returns false', () => {
        expect(isCurrentTimeOperativeOvertime()).toEqual(false)
      })
    })

    describe('and the time is after 4pm', () => {
      beforeEach(() => {
        MockDate.set(dateTime.setHours(16, 0, 1))
      })

      it('returns true', () => {
        expect(isCurrentTimeOperativeOvertime()).toEqual(true)
      })
    })
  })

  describe('when it is a Saturday', () => {
    const dateTime = new Date('Saturday 11 December 2021 12:00:00')
    beforeEach(() => {
      MockDate.set(dateTime)
    })
    it('returns true', () => {
      expect(isCurrentTimeOperativeOvertime()).toEqual(true)
    })
  })

  describe('when it is a Sunday', () => {
    const dateTime = new Date('Sunday 12 December 2021 12:00:00')
    beforeEach(() => {
      MockDate.set(dateTime)
    })
    it('returns true', () => {
      expect(isCurrentTimeOperativeOvertime()).toEqual(true)
    })
  })

  describe('when it is a bank holiday', () => {
    const dateTime = new Date('Monday 13 December 2021 12:00:00')
    beforeEach(() => {
      MockDate.set(dateTime)

      mockBankHolidays.mockReturnValue({
        'england-and-wales': {
          division: 'england-and-wales',
          events: [
            {
              title: 'Fake bank holiday',
              date: '2021-12-13',
              notes: '',
              bunting: true,
            },
          ],
        },
      })
    })
    it('returns true', () => {
      expect(isCurrentTimeOperativeOvertime()).toEqual(true)
    })
  })
})

describe('isOperativeOverTime', () => {
  beforeEach(() => {
    mockBankHolidays.mockReturnValue({
      'england-and-wales': {
        events: [],
      },
    })
  })
  describe('when it is a working day', () => {
    const dateTime = new Date('Thursday 9 December 2021')

    describe('and the time is before 8am', () => {
      it('returns true', () => {
        expect(isOperativeOverTime(dateTime.setHours(7, 59, 0))).toEqual(true)
      })
    })

    describe('and the time is between 8am and 4pm', () => {
      it('returns false', () => {
        expect(isOperativeOverTime(dateTime.setHours(12, 0, 0))).toEqual(false)
      })
    })

    describe('and the time is after 4pm', () => {
      it('returns true', () => {
        expect(isOperativeOverTime(dateTime.setHours(16, 0, 1))).toEqual(true)
      })
    })
  })

  describe('when it is a Saturday', () => {
    const dateTime = new Date('Saturday 11 December 2021 12:00:00')

    it('returns true', () => {
      expect(isOperativeOverTime(dateTime)).toEqual(true)
    })
  })

  describe('when it is a Sunday', () => {
    const dateTime = new Date('Sunday 12 December 2021 12:00:00')
    it('returns true', () => {
      expect(isOperativeOverTime(dateTime)).toEqual(true)
    })
  })

  describe('when it is a bank holiday', () => {
    const dateTime = new Date('Monday 13 December 2021 12:00:00')
    beforeEach(() => {
      mockBankHolidays.mockReturnValue({
        'england-and-wales': {
          division: 'england-and-wales',
          events: [
            {
              title: 'Fake bank holiday',
              date: '2021-12-13',
              notes: '',
              bunting: true,
            },
          ],
        },
      })
    })
    it('returns true', () => {
      expect(isOperativeOverTime(dateTime)).toEqual(true)
    })
  })
})
