import { buildUpdateWorkOrder } from './update-job'

describe('buildUpdateWorkOrder', () => {
  const latestTasks = [
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
      quantity: 3.5,
    },
  ]
  const reference = '00012345'
  const variationReason = 'More work is required'

  it('builds the UpdateWorkOrder form data to post to the Repairs API', () => {
    const UpdateWorkOrderFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
      },
      typeCode: '80',
      comments: 'Variation reason: More work is required',
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
            id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbf',
            customCode: 'XXXX003',
            customName: 'Immediate call outs',
            quantity: {
              amount: [Number.parseFloat('1')],
            },
          },
          {
            customCode: 'XXXX004',
            customName: 'Emergency call out',
            quantity: {
              amount: [Number.parseFloat('3.5')],
            },
          },
        ],
      },
    }

    const response = buildUpdateWorkOrder(
      latestTasks,
      addedTasks,
      reference,
      variationReason
    )

    expect(response).toEqual(UpdateWorkOrderFormData)
  })
})
