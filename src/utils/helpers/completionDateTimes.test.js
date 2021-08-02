import { calculateCompletionDateTime } from './completionDateTimes'
import MockDate from 'mockdate'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from './priorities'

const mockBankHolidays = jest.fn()

jest.mock('./bankHolidays', () => ({
  get bankHolidays() {
    return mockBankHolidays()
  },
}))

describe('calculateCompletionDateTime', () => {
  beforeEach(() => {
    mockBankHolidays.mockReturnValue({
      'england-and-wales': {
        events: [],
      },
    })
  })

  describe('when the priority code represents an immediate order', () => {
    // 2 hours
    const priorityCode = IMMEDIATE_PRIORITY_CODE

    describe('and the work order is created on a working day', () => {
      const dateTime = new Date('Monday 28 June 2021 17:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('adds the configured number of hours to set the target time for the same day', () => {
        const expectedDateTime = new Date(
          dateTime.setHours(dateTime.getHours() + 2)
        )

        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          expectedDateTime
        )
      })
    })

    describe('and the work order is created on a non-working day', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('adds the configured number of hours to set the target time for the same day', () => {
        const expectedDateTime = new Date(
          dateTime.setHours(dateTime.getHours() + 2)
        )

        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          expectedDateTime
        )
      })
    })
  })

  describe('when the priority code represents an emergency order', () => {
    // 1 working day
    const priorityCode = EMERGENCY_PRIORITY_CODE

    describe('and the day of order creation and the day following it are working days', () => {
      const dateTime = new Date('Wednesday 30 June 2021 08:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time for the same time on the configured number of working days from now', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Thursday 1 July 2021 08:00:00Z')
        )
      })
    })

    describe('and the day of order creation is on a Friday before a subsequent, regular working week', () => {
      const dateTime = new Date('Friday 2 July 2021 19:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time for the same time on the configured number of working days from now', () => {
        const expectedDateTime = new Date('Monday 5 July 2021 19:00:00Z')

        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          expectedDateTime
        )
      })
    })

    describe('and the work order is created on a Saturday', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time as if the order had been raised on the preceding working day', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Monday 28 June 2021 09:00:00Z')
        )
      })
    })

    describe('and the work order is created when there are imminent bank holidays', () => {
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

      it('sets the target time as if the order had been raised on the preceding working day with bank holiday respected', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Tuesday 29 June 2021 09:00:00Z')
        )
      })
    })
  })

  describe('when the priority code represents an urgent order', () => {
    // 5 working days
    const priorityCode = URGENT_PRIORITY_CODE

    describe('and the day of order creation is a working day with no imminent bank holidays', () => {
      const dateTime = new Date('Wednesday 7 July 2021 19:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time for the same time on the configured number of working days from now', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Wednesday 14 July 2021 19:00:00Z')
        )
      })
    })

    describe('and the day of order creation is a working day near the end of a year', () => {
      // This fictional scenario currently includes NO bank holidays for the current, simple implementation
      // and instead focuses on getting dates around the year boundary correct

      const dateTime = new Date('Wednesday 29 December 2021 12:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time for the same time on the configured number of working days from now', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Wednesday 5 January 2022 12:00:00Z')
        )
      })
    })

    describe('and the work order is created on a non-working day', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time as if the order had been raised on the preceding working day', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Friday 2 July 2021 09:00:00Z')
        )
      })
    })

    describe('and the work order is created when there are imminent bank holidays', () => {
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

      it('sets the target time as if the order had been raised on the preceding working day with bank holiday respected', () => {
        // 5 working days into the future, as if the order had been raised on Friday and with the bank holiday accounted for
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Monday 5 July 2021 09:00:00Z')
        )
      })
    })
  })

  describe('when the priority code represents a normal order', () => {
    // 21 working days
    const priorityCode = NORMAL_PRIORITY_CODE

    describe('and the day of order creation is a working day with no imminent bank holidays', () => {
      const dateTime = new Date('Tuesday 1 June 2021 19:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time for the same time on the configured number of working days from now', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Wednesday 30 June 2021 19:00:00Z')
        )
      })
    })

    describe('and the day of order creation is a working day near the end of a year', () => {
      // This fictional scenario currently includes NO bank holidays for the current, simple implementation
      // and instead focuses on getting dates around the year boundary correct

      const dateTime = new Date('Wednesday 29 December 2021 12:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time for the same time on the configured number of working days from now', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Thursday 27 January 2022 12:00:00Z')
        )
      })
    })

    describe('and the work order is created on a non-working day', () => {
      const dateTime = new Date('Saturday 26 June 2021 09:00:00Z')

      beforeEach(() => {
        MockDate.set(dateTime)
      })

      afterEach(() => {
        MockDate.reset()
      })

      it('sets the target time as if the order had been raised on the preceding working day', () => {
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Monday 26 July 2021 09:00:00Z')
        )
      })
    })

    describe('and the work order is created when there are imminent bank holidays', () => {
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
              {
                title: 'Fake bank holiday',
                date: '2021-07-26',
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

      it('sets the target time as if the order had been raised on the preceding working day with bank holiday respected', () => {
        // 21 working days into the future, as if the order had been raised on Friday and with the 2 bank holidays accounted for
        expect(calculateCompletionDateTime(priorityCode)).toEqual(
          new Date('Wednesday 28 July 2021 09:00:00Z')
        )
      })
    })
  })
})
