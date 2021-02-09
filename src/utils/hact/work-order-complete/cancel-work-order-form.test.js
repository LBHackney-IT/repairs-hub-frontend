import MockDate from 'mockdate'
import { buildCancelWorkOrderFormData } from './cancel-work-order-form'

describe('buildCancelWorkOrderFormData', () => {
  const formData = {
    workOrderReference: '10233332',
    cancelReason: 'Made in error',
  }

  it('builds the notes to post to the JobStatusUpdate endpoint in Repairs API', async () => {
    // 2021-01-14T18:16:20.986Z
    MockDate.set(1610648180986)

    const jobStatusUpdateFormData = {
      workOrderReference: {
        id: '10233332',
      },
      jobStatusUpdates: [
        {
          typeCode: 0,
          otherType: 'cancel',
          comments: 'Cancelled: Made in error',
          eventTime: new Date('2021-01-14T18:16:20.986Z'),
        },
      ],
    }

    const response = buildCancelWorkOrderFormData(formData)
    expect(response).toEqual(jobStatusUpdateFormData)
  })
})
