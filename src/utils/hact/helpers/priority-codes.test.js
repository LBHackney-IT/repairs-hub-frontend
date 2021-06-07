import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '../../helpers/priorities'
import { priorityCodeCompletionTimes } from './priority-codes'

describe('priorityCodeCompletionTimes', () => {
  it('should map to the correct values', () => {
    expect(priorityCodeCompletionTimes[IMMEDIATE_PRIORITY_CODE]).toEqual({
      numberOfHours: 2,
      numberOfDays: 0,
    })
    expect(priorityCodeCompletionTimes[EMERGENCY_PRIORITY_CODE]).toEqual({
      numberOfHours: 24,
      numberOfDays: 1,
    })
    expect(priorityCodeCompletionTimes[URGENT_PRIORITY_CODE]).toEqual({
      numberOfHours: 120,
      numberOfDays: 5,
    })
    expect(priorityCodeCompletionTimes[NORMAL_PRIORITY_CODE]).toEqual({
      numberOfHours: 504,
      numberOfDays: 21,
    })
  })
})
