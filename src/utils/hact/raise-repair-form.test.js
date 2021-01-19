import MockDate from 'mockdate'
import { buildRaiseRepairFormData } from './raise-repair-form'

describe('buildRaiseRepairFormData', () => {
  it('builds the RaiseRepair form data to post to the Repairs API', async () => {
    // 2021-01-14T18:16:20.986Z
    MockDate.set(1610648180986)

    const formData = {
      sorCode: 'DES5R006',
      sorCodeDescription: 'Urgent call outs',
      quantity: '1',
      priorityDescription: 'U - Urgent (5 Working days)',
      priorityCode: '3',
      descriptionOfWork: 'This is an urgent test description',
    }

    const raiseRepairFormData = {
      descriptionOfWork: 'This is an urgent test description',
      priority: {
        priorityCode: 2,
        priorityDescription: 'U - Urgent (5 Working days)',
        requiredCompletionDateTime: new Date('2021-01-21T18:16:20.986Z'),
      },
      workClass: {
        workClassCode: 0,
      },
      workElement: [
        {
          rateScheduleItem: [
            {
              customCode: 'DES5R006',
              customName: 'Urgent call outs',
              quantity: { amount: 1 },
            },
          ],
        },
      ],
    }

    const response = buildRaiseRepairFormData(formData)
    expect(response).toEqual(raiseRepairFormData)
  })
})
