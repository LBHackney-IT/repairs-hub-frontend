import { priorityCodeCompletionTimes } from './priority-codes'

describe('priorityCodeCompletionTimes', () => {
  it('should map to the correct values', () => {
    expect(priorityCodeCompletionTimes[1]).toEqual({
      numberOfHours: 2,
      numberOfDays: 0,
    })
    expect(priorityCodeCompletionTimes[2]).toEqual({
      numberOfHours: 24,
      numberOfDays: 1,
    })
    expect(priorityCodeCompletionTimes[3]).toEqual({
      numberOfHours: 120,
      numberOfDays: 5,
    })
    expect(priorityCodeCompletionTimes[4]).toEqual({
      numberOfHours: 504,
      numberOfDays: 21,
    })
  })
})
