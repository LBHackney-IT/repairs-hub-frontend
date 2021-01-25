import {
  mapPriorityCodeToHact,
  calculateRequiredCompletionDateTime,
} from './priority-codes'

export const buildRaiseRepairFormData = (formData) => {
  return {
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
    sitePropertyUnit: [
      {
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
  }
}
