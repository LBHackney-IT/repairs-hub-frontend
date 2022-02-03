import { v4 as uuidv4 } from 'uuid'
import { calculateCompletionDateTime } from '../../helpers/completionDateTimes'
import { HIGH_PRIORITY_CODES } from '@/utils/helpers/priorities'

export const buildScheduleWorkOrderFormData = (workOrderData) => {
  return {
    reference: [
      {
        id: uuidv4(),
      },
    ],
    descriptionOfWork: workOrderData.descriptionOfWork,
    priority: {
      priorityCode: Number.parseInt(workOrderData.priorityCode),
      priorityDescription: workOrderData.priorityDescription,
      requiredCompletionDateTime: calculateCompletionDateTime({
        workingDays: workOrderData.daysToComplete,
        workingHours: workOrderData.hoursToComplete,
        lowPriority: !HIGH_PRIORITY_CODES.includes(
          Number.parseInt(workOrderData.priorityCode)
        ),
        plannedPriority: Number.parseInt(workOrderData.priorityCode) == 9,
      }),
      numberOfDays: workOrderData.daysToComplete,
    },
    workClass: {
      workClassCode: 0,
    },
    workElement: workOrderData.rateScheduleItems
      .map((item) => {
        return [
          {
            rateScheduleItem: [
              {
                customCode: item.code.split(' - ')[0],
                customName: item.description,
                quantity: {
                  amount: [Number.parseFloat(item.quantity)],
                },
              },
            ],
            trade: [
              {
                // Hardcoding this as 'SP' - 'Specialist' as code is a mandatory field
                // but we will only use the customCode field from the API.
                // There is no 'other' type code to use so this appears to be the
                // most generic one in the permitted list
                code: 'SP',
                customCode: workOrderData.tradeCode,
                customName: workOrderData.trade,
              },
            ],
          },
        ]
      })
      .flat(),
    site: {
      property: [
        {
          propertyReference: workOrderData.propertyReference,
          address: {
            addressLine: [workOrderData.shortAddress],
            postalCode: workOrderData.postalCode,
          },
          reference: [
            {
              id: workOrderData.propertyReference,
            },
          ],
        },
      ],
    },
    instructedBy: {
      name: 'Hackney Housing',
    },
    assignedToPrimary: {
      name: workOrderData.contractor.split(' - ')[0],
      organization: {
        reference: [
          {
            id: workOrderData.contractorRef,
          },
        ],
      },
    },
    customer: {
      name: workOrderData.callerName,
      person: {
        name: {
          full: workOrderData.callerName,
        },
        communication: [
          {
            channel: {
              // Audio
              medium: '20',
              // Mobile Phone
              code: '60',
            },
            value: workOrderData.contactNumber,
          },
        ],
      },
    },
  }
}
