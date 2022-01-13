export const buildVariationAuthorisationApprovedFormData = (
  workOrderReference
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    // 100-20 Additional work approved by operative.
    // Additional work approved: the additional work required has been approved by the supervisor/repairs team
    typeCode: '100-20',
  }
}

export const buildVariationAuthorisationRejectedFormData = (
  formData,
  workOrderReference
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    comments: `Variation rejected: ${formData.note}`,
    // Custom code 125 for variation rejected
    typeCode: '125',
  }
}

export const buildAuthorisationApprovedFormData = (workOrderReference) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    // Custom code 23 for authorisation approved
    typeCode: '23',
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
    comments: `Authorisation rejected: ${formData.note}`,
    // Custom code 22 for authorisation rejected
    typeCode: '22',
  }
}
