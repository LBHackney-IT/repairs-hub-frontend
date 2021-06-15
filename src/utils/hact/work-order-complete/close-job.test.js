import { buildCloseWorkOrderData } from './close-job'
describe('buildCloseWorkOrderData', () => {
  const completionDate = new Date(
    'Wed Jan 20 2021 15:46:57 GMT+0000 (Greenwich Mean Time)'
  )
  const notes = 'hello'
  const reference = '00012346'

  //typeCode 0 for Job Completed
  it('builds the ScheduleRepair form data to post to the Repairs API with typeCode 0', async () => {
    const CloseWorkOrderFormData = {
      workOrderReference: {
        id: reference,
        description: '',
        allocatedBy: '',
      },
      jobStatusUpdates: [
        {
          typeCode: '0',
          otherType: 'complete',
          comments: `Work order closed - ${notes}`,
          eventTime: completionDate,
        },
      ],
    }

    const response = buildCloseWorkOrderData(
      completionDate,
      notes,
      reference,
      'Job Completed'
    )
    expect(response).toEqual(CloseWorkOrderFormData)
  })

  //typeCode 70 for No Access
  it('builds the ScheduleRepair form data to post to the Repairs API with typeCode 70', async () => {
    const CloseWorkOrderFormData = {
      workOrderReference: {
        id: reference,
        description: '',
        allocatedBy: '',
      },
      jobStatusUpdates: [
        {
          typeCode: '70',
          otherType: 'complete',
          comments: `Work order closed - ${notes}`,
          eventTime: completionDate,
        },
      ],
    }

    const response = buildCloseWorkOrderData(
      completionDate,
      notes,
      reference,
      'No Access'
    )
    expect(response).toEqual(CloseWorkOrderFormData)
  })
})
