import {
  isCurrentTimeOperativeOvertime,
  isCurrentTimeOutOfHours,
} from './completionDateTimes'
import MockDate from 'mockdate'

const mockBankHolidays = jest.fn()

jest.mock('./bankHolidays', () => ({
  get bankHolidays() {
    return mockBankHolidays()
  },
}))

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
