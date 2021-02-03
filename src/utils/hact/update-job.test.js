import { buildUpdateJob } from './update-job'
describe('buildUpdateJob', () => {
  const existingTasks = [
    { code: 'XXXX003 - Immediate call outs', cost: '10', quantity: 1 },
  ]
  const addedTasks = [
    { id: 0, code: 'XXXX004 - Emergency call out', quantity: 3 },
  ]
  const reference = '00012345'

  it('builds the UpdateJob form data to post to the Repairs API', async () => {
    const updateJobFormData = {
      relatedWorkOrderReference: {
        id: '00012345',
        description: '',
        allocatedBy: '',
      },
      typeCode: 8,
      moreSpecificSORCode: {
        rateScheduleItem: [
          {
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

    const response = buildUpdateJob(existingTasks, addedTasks, reference)
    expect(response).toEqual(updateJobFormData)
  })
})
