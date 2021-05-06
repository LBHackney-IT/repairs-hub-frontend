import { calculateCompletionDateTime } from './completionDateTimes'
import MockDate from 'mockdate'

describe('calculateCompletionDateTime', () => {
  describe('when the priority code represents an immediate order', () => {
    // 2 hours
    const priorityCode = 1

    const dateTime = new Date('Monday 28 June 2021 17:00:00Z')

    beforeEach(() => {
      MockDate.set(dateTime)
    })

    afterEach(() => {
      MockDate.reset()
    })

    it('adds the configured number of hours to set the target time', () => {
      const expectedDateTime = new Date(
        dateTime.setHours(dateTime.getHours() + 2)
      )

      expect(calculateCompletionDateTime(priorityCode)).toEqual(
        expectedDateTime
      )
    })

    xdescribe('and the works order is created on a non-working day', () => {})
  })

  describe('when the priority code represents an emergency order', () => {
    // 1 working day
    const priorityCode = 2

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

    xdescribe('and the works order is created on a non-working day', () => {})
    xdescribe('and the works order is created when there are imminent bank holidays', () => {})
  })

  describe('when the priority code represents an urgent order', () => {
    // 5 working days
    const priorityCode = 3

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

    xdescribe('and the works order is created on a non-working day', () => {})
    xdescribe('and the works order is created when there are imminent bank holidays', () => {})
  })

  describe('when the priority code represents a normal order', () => {
    // 21 working days
    const priorityCode = 4

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

    xdescribe('and the works order is created on a non-working day', () => {})
    xdescribe('and the works order is created when there are imminent bank holidays', () => {})
  })
})
