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
  }
}
