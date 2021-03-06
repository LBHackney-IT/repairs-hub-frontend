import MockDate from 'mockdate'
import { URGENT_PRIORITY_CODE } from '../../helpers/priorities'
import { buildScheduleRepairFormData } from './raise-repair-form'

const mockBankHolidays = jest.fn()

jest.mock('../../helpers/bank-holidays', () => ({
  get bankHolidays() {
    return mockBankHolidays()
  },
}))

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'aa757643-cf89-4247-a42c-8a035182feqd'),
  }
})

describe('buildRaiseRepairFormData', () => {
  const formData = {
    rateScheduleItems: [
      {
        code: 'DES5R006 - Urgent call outs',
        description: 'Urgent call outs',
        quantity: '1',
      },
      {
        code: 'DES5R005 - Normal call outs',
        description: 'Normal call outs',
        quantity: '3.25',
      },
    ],
    trade: 'Plumbing',
    tradeCode: 'PL',
    contractor: 'Purdy Contracts (P) Ltd - PCL',
    contractorRef: 'PCL',
    quantity: '1',
    priorityDescription: '4 [U] URGENT',
    priorityCode: URGENT_PRIORITY_CODE,
    descriptionOfWork: 'This is an urgent test description',
    propertyReference: '00001234',
    shortAddress: '12 Pitcairn House',
    postalCode: 'E9 6PT',
    callerName: 'John Smith',
    contactNumber: '07788777888',
  }

  it('builds the ScheduleRepair form data to post to the Repairs API', async () => {
    MockDate.set(new Date('Thu Jan 14 2021 18:16:20Z'))

    // set the following Monday as a bank holiday
    mockBankHolidays.mockReturnValue({
      'england-and-wales': {
        division: 'england-and-wales',
        events: [
          {
            date: '2021-01-19',
          },
        ],
      },
    })

    const scheduleRepairFormData = {
      reference: [
        {
          id: 'aa757643-cf89-4247-a42c-8a035182feqd',
        },
      ],
      descriptionOfWork: 'This is an urgent test description',
      priority: {
        priorityCode: URGENT_PRIORITY_CODE,
        priorityDescription: '4 [U] URGENT',
        requiredCompletionDateTime: new Date('Friday Jan 22 2021 18:16:20Z'),
        numberOfDays: 5,
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
          trade: [
            {
              code: 'SP',
              customCode: 'PL',
              customName: 'Plumbing',
            },
          ],
        },
        {
          rateScheduleItem: [
            {
              customCode: 'DES5R005',
              customName: 'Normal call outs',
              quantity: { amount: [3.25] },
            },
          ],
          trade: [
            {
              code: 'SP',
              customCode: 'PL',
              customName: 'Plumbing',
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
              postalCode: 'E9 6PT',
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
        name: 'Purdy Contracts (P) Ltd',
        organization: {
          reference: [
            {
              id: 'PCL',
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
      },
    }

    const response = buildScheduleRepairFormData(formData)
    expect(response).toEqual(scheduleRepairFormData)
  })
})
