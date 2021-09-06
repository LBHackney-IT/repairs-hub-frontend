import { areTasksUpdated } from './tasks'

describe('areTasksUpdated', () => {
  const notUpdatedTasks = [
    { code: '100005', quantity: 2, originalQuantity: 2 },
    { code: '100003', quantity: 1, originalQuantity: 1 },
  ]

  const updatedTasks = [
    { code: '100005', quantity: 2, originalQuantity: 3 },
    { code: '100003', quantity: 1, originalQuantity: 4 },
  ]

  it('returns FALSE if tasks were NOT updated', () => {
    expect(areTasksUpdated(notUpdatedTasks)).toEqual(false)
  })

  it('returns TRUE if tasks were updated', () => {
    expect(areTasksUpdated(updatedTasks)).toEqual(true)
  })
})
