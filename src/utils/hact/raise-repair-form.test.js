import MockDate from 'mockdate'
import { buildScheduleRepairFormData } from './raise-repair-form'

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'aa757643-cf89-4247-a42c-8a035182feqd'),
  }
})

describe('buildRaiseRepairFormData', () => {
  const formData = {
    sorCodesCollection: [
      {
        code: 'DES5R006 - Urgent call outs',
        description: 'Urgent call outs',
        quantity: '1',
        contractorRef: 'H01',
      },
      {
        code: 'DES5R005 - Normal call outs',
        description: 'Normal call outs',
        quantity: '3',
        contractorRef: 'H01',
      },
    ],
    quantity: '1',
    priorityDescription: 'U - Urgent (5 Working days)',
    priorityCode: '3',
    descriptionOfWork: 'This is an urgent test description',
    propertyReference: '00001234',
    shortAddress: '12 Pitcairn House',
    callerName: 'John Smith',
    contactNumber: '07788777888',
  }

  it('builds the ScheduleRepair form data to post to the Repairs API', async () => {
    // 2021-01-14T18:16:20.986Z
    MockDate.set(1610648180986)

    const scheduleRepairFormData = {
      reference: [
        {
          id: 'aa757643-cf89-4247-a42c-8a035182feqd',
        },
      ],
      descriptionOfWork: 'This is an urgent test description',
      priority: {
        priorityCode: 2,
        priorityDescription: 'U - Urgent (5 Working days)',
        requiredCompletionDateTime: new Date('2021-01-21T18:16:20.986Z'),
        numberOfDays: 7,
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
              quantity: { amount: [1] },
            },
          ],
        },
        {
          rateScheduleItem: [
            {
              customCode: 'DES5R005',
              customName: 'Normal call outs',
              quantity: { amount: [3] },
            },
          ],
        },
      ],
      site: {
        property: [
          {
            propertyReference: '00001234',
            address: {
              addressLine: ['12 Pitcairn House'],
            },
            reference: [
              {
                id: '00001234',
              },
            ],
          },
        ],
      },
      instructedBy: {
        name: 'Hackney Housing',
      },
      assignedToPrimary: {
        name: 'Contractor H01',
        organization: {
          reference: [
            {
              id: 'H01',
            },
          ],
        },
      },
      customer: {
        name: 'John Smith',
        person: {
          name: {
            full: 'John Smith',
          },
          contact: [
            {
              name: {
                full: 'John Smith',
              },
              communication: [
                {
                  channel: {
                    medium: '20',
                    code: '60',
                  },
                  value: '07788777888',
                },
              ],
            },
          ],
        },
      },
    }

    const response = buildScheduleRepairFormData(formData)
    expect(response).toEqual(scheduleRepairFormData)
  })
})
