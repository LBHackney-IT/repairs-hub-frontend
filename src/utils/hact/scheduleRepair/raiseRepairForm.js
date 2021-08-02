import { v4 as uuidv4 } from 'uuid'
import { priorityCodeCompletionTimes } from '../helpers/priorityCodes'
import { calculateCompletionDateTime } from '../../helpers/completionDateTimes'

export const buildScheduleRepairFormData = (formData) => {
  return {
    reference: [
      {
        id: uuidv4(),
      },
    ],
    descriptionOfWork: formData.descriptionOfWork,
    priority: {
      priorityCode: Number.parseInt(formData.priorityCode),
      priorityDescription: formData.priorityDescription,
      requiredCompletionDateTime: calculateCompletionDateTime(
        formData.priorityCode
      ),
      numberOfDays:
        priorityCodeCompletionTimes[formData.priorityCode].numberOfDays,
    },
    workClass: {
      workClassCode: 0,
    },
    workElement: formData.rateScheduleItems
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
                customCode: formData.tradeCode,
                customName: formData.trade,
              },
            ],
          },
        ]
      })
      .flat(),
    site: {
      property: [
        {
          propertyReference: formData.propertyReference,
          address: {
            addressLine: [formData.shortAddress],
            postalCode: formData.postalCode,
          },
          reference: [
            {
              id: formData.propertyReference,
            },
          ],
        },
      ],
    },
    instructedBy: {
      name: 'Hackney Housing',
    },
    assignedToPrimary: {
      name: formData.contractor.split(' - ')[0],
      organization: {
        reference: [
          {
            id: formData.contractorRef,
          },
        ],
      },
    },
    customer: {
      name: formData.callerName,
      person: {
        name: {
          full: formData.callerName,
        },
        communication: [
          {
            channel: {
              // Audio
              medium: '20',
              // Mobile Phone
              code: '60',
            },
            value: formData.contactNumber,
          },
        ],
      },
    },
  }
}
