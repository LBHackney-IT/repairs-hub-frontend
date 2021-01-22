import { v4 as uuidv4 } from 'uuid'
import {
  mapPriorityCodeToHact,
  calculateRequiredCompletionDateTime,
} from './priority-codes'

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
    workElement: [
      {
        rateScheduleItem: [
          {
            customCode: formData.sorCode,
            customName: formData.sorCodeDescription,
            quantity: {
              amount: [Number.parseInt(formData.quantity)],
            },
          },
        ],
      },
    ],
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
      name: `Contractor ${formData.sorCodeContractorRef}`,
      organization: {
        reference: [
          {
            id: formData.sorCodeContractorRef,
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
        contact: [
          {
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
        ],
      },
    },
  }
}
