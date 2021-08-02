import { buildScheduleAppointmentData } from './scheduleAppointment'
describe('buildScheduleAppointmentData', () => {
  const workOrderReference = '10000197'
  const appointmentReference = '34/2021-02-25'

  it('builds the appointment form data to post to the Repairs API', async () => {
    const appointmentData = {
      workOrderReference: {
        id: 10000197,
        description: '',
        allocatedBy: '',
      },
      appointmentReference: {
        id: '34/2021-02-25',
        description: '',
        allocatedBy: '',
      },
    }

    const response = buildScheduleAppointmentData(
      workOrderReference,
      appointmentReference
    )
    expect(response).toEqual(appointmentData)
  })
})
