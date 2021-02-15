import { mapPriorityCodeToHact } from './priority-codes'

describe('Priority code HACT mapping object', () => {
  it('should map to the correct values', () => {
    expect(mapPriorityCodeToHact[1]).toEqual({
      numberOfHours: 2,
      numberOfDays: 0,
      priorityCodeHact: 1,
    })
    expect(mapPriorityCodeToHact[2]).toEqual({
      numberOfHours: 24,
      numberOfDays: 1,
      priorityCodeHact: 1,
    })
    expect(mapPriorityCodeToHact[3]).toEqual({
      numberOfHours: 168,
      numberOfDays: 7,
      priorityCodeHact: 2,
    })
    expect(mapPriorityCodeToHact[4]).toEqual({
      numberOfHours: 720,
      numberOfDays: 30,
      priorityCodeHact: 3,
    })
    expect(mapPriorityCodeToHact[5]).toEqual({
      numberOfHours: 8760,
      numberOfDays: 365,
      priorityCodeHact: 4,
    })
  })
})
