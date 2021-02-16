import { getAvailableAppointments } from './appointments'
import mockAxios from '../__mocks__/axios'

describe('getAvailableAppointments', () => {
  it('calls the Next JS API', async () => {
    const responseData = [
      {
        date: '2021-02-15T00:00:00',
        slots: [
          {
            reference: '31/2021-02-15',
            description: 'AM Slot',
            start: '2000-01-01T08:00:00',
            end: '2000-01-01T13:00:00',
          },
          {
            reference: '41/2021-02-15',
            description: 'PM Slot',
            start: '2000-01-01T12:00:00',
            end: '2000-01-01T18:00:00',
          },
        ],
      },
    ]

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: responseData })
    )

    const workOrderReference = '10000012'
    const fromDate = new Date('2021-02-15T00:00:00Z')
    const toDate = new Date('2021-02-21T00:00:00Z')

    const response = await getAvailableAppointments(
      workOrderReference,
      fromDate,
      toDate
    )

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/appointments', {
      params: {
        workOrderReference: '10000012',
        fromDate: '2021-02-15',
        toDate: '2021-02-21',
      },
    })
  })
})
