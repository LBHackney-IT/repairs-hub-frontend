import { v4 as uuidv4 } from 'uuid'
import {
  mapPriorityCodeToHact,
  calculateRequiredCompletionDateTime,
} from '../helpers/priority-codes'

export const buildScheduleRepairFormData = (formData) => {
  return {
    reference: [
      {
        id: uuidv4(),
      },
    ],
    descriptionOfWork: formData.descriptionOfWork,
    priority: {
      priorityCode:
        mapPriorityCodeToHact[formData.priorityCode].priorityCodeHact,
      priorityDescription: formData.priorityDescription,
      requiredCompletionDateTime: calculateRequiredCompletionDateTime(
        mapPriorityCodeToHact[formData.priorityCode].numberOfHours
      ),
      numberOfDays: mapPriorityCodeToHact[formData.priorityCode].numberOfDays,
    },
    workClass: {
      workClassCode: 0,
    },
    workElement: formData.sorCodesCollection
      .map((item) => {
        return [
          {
            rateScheduleItem: [
              {
                customCode: item.code.split(' - ')[0],
                customName: item.description,
                quantity: {
                  amount: [Number.parseInt(item.quantity)],
                },
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
      name: `Contractor ${formData.sorCodesCollection[0].contractorRef}`,
      organization: {
        reference: [
          {
            id: formData.sorCodesCollection[0].contractorRef,
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
