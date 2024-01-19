import {
  workOrderNoteFragmentForPaymentType,
  OVERTIME_PAYMENT_TYPE,
} from '../../paymentTypes'

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
        ...(paymentType && { paymentType }),
      },
    ],
  }
}

export const buildDampAndMouldReportData = (
  address,
  isDampOrMouldInProperty,
  residentPreviouslyReported,
  resolvedAtTheTime,
  comments
) => {
  const requestData = {
    address: address,
    dampAndMouldPresenceConfirmed: isDampOrMouldInProperty === 'Yes',
    // following the logic, previouslyReported and comments would only be visible if there is
    // potentially damp/mould presence in the property
    // if there is no damp/mould, no report would be created
    // hence, no need to conditionally add these fields
    previouslyReported: residentPreviouslyReported === 'Yes',
    comments: comments ?? '',
  }

  if (requestData.previouslyReported) {
    // resolvedAtTheTime only enabled if previously reported
    requestData['previousReportResolved'] = resolvedAtTheTime === 'Yes'
  }

  return requestData
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
  paymentType
) => {
  notes =
    operativesWithPercentages.length > 0
      ? [
          notes,
          `Assigned operatives ${operativesAndPercentagesForNotes(
            operativesWithPercentages,
            paymentType !== OVERTIME_PAYMENT_TYPE
          )}`,
        ]
          .filter((s) => s)
          .join(' - ')
      : notes

  return [notes, workOrderNoteFragmentForPaymentType(paymentType)]
    .filter((x) => x)
    .join(' - ')
}
