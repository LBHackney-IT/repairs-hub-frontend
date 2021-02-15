import MockDate from 'mockdate'
import { canCancelWorkOrder } from './cancel-work-order'

describe('canCancelWorkOrder', () => {
  // 2021-01-14T18:16:20.986Z
  MockDate.set(1610648180986)

  it('returns true if less than an hour has passed since date raised', () => {
    const date = new Date(
      'Thu Jan 14 2021 17:17:20 GMT+0000 (Greenwich Mean Time)'
    )

    expect(canCancelWorkOrder(date)).toEqual(true)
  })

  it('returns false if more than an hour has passed since date raised', () => {
    const date = new Date(
      'Thu Jan 14 2021 17:15:20 GMT+0000 (Greenwich Mean Time)'
    )

    expect(canCancelWorkOrder(date)).toEqual(false)
  })
})
