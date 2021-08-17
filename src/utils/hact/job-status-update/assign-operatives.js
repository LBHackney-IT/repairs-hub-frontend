export const buildOperativeAssignmentFormData = (
  workOrderReference,
  operatives
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    operativesAssigned: operatives.map((op) => ({
      identification: {
        number: op.operative.id,
      },
      calculatedBonus:
        op.percentage == '-' ? 0 : parseFloat(op.percentage.slice(0, -1)),
    })),
    typeCode: '10',
  }
}
