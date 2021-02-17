import { getAvailableSlots } from './appointments'

describe('getAvailableSlots', () => {
  it('finds selected date from all available dates', () => {
    const date = new Date(
      'Fri Feb 26 2021 00:00:00 GMT+0000 (Greenwich Mean Time)'
    )
    const availableSlots = [
      {
        date: '2021-02-16T00:00:00',
        slots: [{ description: 'AM Slot' }, { description: 'PM Slot' }],
      },
      {
        date: '2021-02-26T00:00:00',
        slots: [{ description: 'AM Slot' }, { description: 'PM Slot' }],
      },
    ]

    expect(getAvailableSlots(date, availableSlots)).toEqual({
      date: '2021-02-26T00:00:00',
      slots: [{ description: 'AM Slot' }, { description: 'PM Slot' }],
    })
  })
})
