import {
  workOrderNoteFragmentForPaymentType,
  OVERTIME_PAYMENT_TYPE,
} from '../../paymentTypes'

export const buildCloseWorkOrderData = (
  completionDate,
  notes,
  reference,
  reason,
  paymentType,
  followOnRequest = null
) => {
  const dataObject = {
    workOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    jobStatusUpdates: [
      {
        typeCode: reason == 'No Access' ? '70' : '0',
        otherType: 'completed',
        comments: notes,
        eventTime: completionDate,
        ...(paymentType && { paymentType }),
        noteGeneratedOnFrontend: true,
      },
    ],
  }

  if (followOnRequest !== null) {
    dataObject['followOnRequest'] = followOnRequest
  }

  return dataObject
}

export const buildFollowOnRequestData = (
  isSameTrade,
  isDifferentTrades,
  isMultipleOperatives,
  requiredFollowOnTrades,
  followOnTypeDescription,
  stockItemsRequired,
  nonStockItemsRequired,
  materialNotes,
  additionalNotes
) => {
  return {
    isSameTrade,
    isDifferentTrades,
    isMultipleOperatives,
    requiredFollowOnTrades,
    followOnTypeDescription,
    stockItemsRequired,
    nonStockItemsRequired,
    materialNotes,
    additionalNotes,
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
