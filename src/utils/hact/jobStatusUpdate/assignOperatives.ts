type OperativeAssignment = {
  operative: { id: string | number }
  percentage: string
}

export const buildOperativeAssignmentFormData = (
  workOrderReference: string,
  operatives: OperativeAssignment[],
  operativesNotes?: string,
  isSplit?: boolean
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
    ...(operativesNotes && {
      comments: `Work order updated - ${operativesNotes}`,
    }),
    ...(isSplit && { isSplit: isSplit }),
    typeCode: '10',
  }
}
