import { buildUpdateJob } from './update-job'

describe('buildUpdateJob', () => {
  const existingTasks = [
    {
      id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
      code: 'XXXX003 - Immediate call outs',
      description: 'Immediate call outs',
      cost: '10',
      quantity: 1,
    },
  ]
  const addedTasks = [
    {
      id: 0,
      code: 'XXXX004 - Emergency call out',
      description: 'Emergency call out',
      quantity: 3,
    },
  ]
  const reference = '00012345'
  const variationReason = 'More work is required'

  it('builds the UpdateJob form data to post to the Repairs API', async () => {
    const updateJobFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      typeCode: 8,
      comments: 'Variation reason: More work is required',
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
            id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
            customCode: 'XXXX003',
            customName: 'Immediate call outs',
            quantity: {
              amount: [Number.parseInt('1')],
            },
          },
          {
            customCode: 'XXXX004',
            customName: 'Emergency call out',
            quantity: {
              amount: [Number.parseInt('3')],
            },
          },
        ],
      },
    }

    const response = buildUpdateJob(
      existingTasks,
      addedTasks,
      reference,
      variationReason
    )
    expect(response).toEqual(updateJobFormData)
  })
})
