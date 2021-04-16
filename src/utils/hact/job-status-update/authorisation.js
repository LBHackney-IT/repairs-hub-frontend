export const buildAuthorisationApprovedFormData = (workOrderReference) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    // 100-20 Additional work approved by operative.
    // Additional work approved: the additional work required has been approved by the supervisor/repairs team

    typeCode: '100-20',
  }
}

export const buildAuthorisationRejectedFormData = (
  formData,
  workOrderReference
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    comments: `Variation rejected: ${formData.note}`,

    //custome code for variation rejected is 125

    typeCode: '125',
  }
}
