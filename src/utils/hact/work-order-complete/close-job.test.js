import { buildCloseWorkOrderData } from './close-job'
describe('buildCloseWorkOrderData', () => {
  const completionDate = new Date(
    'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
  )
  const notes = 'hello'
  const reference = '00012346'

  it('builds the ScheduleRepair form data to post to the Repairs API', async () => {
    const CloseWorkOrderFormData = {
      workOrderReference: {
        id: reference,
        description: '',
        allocatedBy: '',
      },
      jobStatusUpdates: [
        {
          typeCode: 0,
          otherType: 'complete',
          comments: notes,
          eventTime: completionDate,
        },
      ],
    }

    const response = buildCloseWorkOrderData(completionDate, notes, reference)
    expect(response).toEqual(CloseWorkOrderFormData)
  })
})
