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
      ...(process.env.NEXT_PUBLIC_OPERATIVE_SPLITTING_ENABLED === 'true' && {
        calculatedBonus:
          op.percentage == '-' ? 0 : parseFloat(op.percentage.slice(0, -1)),
      }),
    })),
    typeCode: '10',
  }
}
