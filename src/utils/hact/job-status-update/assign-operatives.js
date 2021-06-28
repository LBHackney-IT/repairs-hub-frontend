export const buildOperativeAssignmentFormData = (
  workOrderReference,
  operatives
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    operativesAssigned: operatives.map((operative) => ({
      identification: {
        number: operative.id,
      },
    })),
    typeCode: '10',
  }
}
