export const buildCloseWorkOrderData = (
  completionDate,
  notes,
  reference,
  reason,
  paymentType
) => {
  return {
    workOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    jobStatusUpdates: [
      {
        typeCode: reason == 'No Access' ? '70' : '0',
        otherType: 'completed',
        comments: `Work order closed - ${notes}`,
        eventTime: completionDate,
        paymentType,
      },
    ],
  }
}

const operativesAndPercentagesForNotes = (
  operativesWithPercentages,
  showPercentages = true
) => {
  return operativesWithPercentages
    .map(
      (op) =>
        `${op.operative.name}${
          op.percentage && showPercentages ? ` : ${op.percentage}` : ''
        }`
    )
    .join(', ')
}

export const buildWorkOrderCompleteNotes = (
  notes,
  operativesWithPercentages,
  isOvertime = false
) => {
  notes =
    operativesWithPercentages.length > 0
      ? [
          notes,
          `Assigned operatives ${operativesAndPercentagesForNotes(
            operativesWithPercentages,
            !isOvertime
          )}`,
        ]
          .filter((s) => s)
          .join(' - ')
      : notes

  if (isOvertime) {
    notes = `${notes} - Overtime`
  }

  return notes
}
