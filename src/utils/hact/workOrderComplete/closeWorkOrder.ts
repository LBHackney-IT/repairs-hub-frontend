import {
  workOrderNoteFragmentForPaymentType,
  OVERTIME_PAYMENT_TYPE,
} from '../../paymentTypes'

export type followOnDataRequest = {
  isSameTrade: boolean
  isDifferentTrades: boolean
  isMultipleOperatives: boolean
  requiredFollowOnTrades: string[]
  followOnTypeDescription: string
  stockItemsRequired: boolean
  nonStockItemsRequired: boolean
  materialNotes: string
  additionalNotes: string
  supervisorCalled: boolean
  estimatedDuration: string
  otherTrade?: string
}

export type closeWorkOrderDataRequest = {
  workOrderReference: {
    id: string
    description: string
    allocatedBy: string
  }
  jobStatusUpdates: jobStatusUpdateDataRequest[]
  followOnRequest?: followOnDataRequest
}

export type jobStatusUpdateDataRequest = {
  typeCode: string
  otherType: string
  comments: string
  eventTime: Date
  paymentType?: string
  noteGeneratedOnFrontend: boolean
}

export type operativeWithPercentage = {
  operative: {
    name: string
  }
  percentage: number
}

export const buildCloseWorkOrderData = (
  completionDate: Date,
  notes: string,
  reference: string,
  reason: string,
  paymentType: string,
  followOnFunctionalityEnabled: boolean,
  followOnRequest: followOnDataRequest = null
): closeWorkOrderDataRequest => {
  const typeCode = reason == 'No Access' ? '70' : '0'

  const jobStatusUpdate = {
    typeCode,
    otherType: 'completed',
    comments: notes,
    eventTime: completionDate,
    ...(paymentType && { paymentType }),
    noteGeneratedOnFrontend: false,
  }

  const dataObject = {
    workOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    jobStatusUpdates: [jobStatusUpdate],
  }

  // feature toggle
  if (followOnFunctionalityEnabled) {
    if (typeCode === '0') {
      // completed job note is generated on frontend
      jobStatusUpdate.noteGeneratedOnFrontend = true
    }

    if (followOnRequest !== null) {
      dataObject['followOnRequest'] = followOnRequest
    }
  }

  return dataObject
}

export const buildFollowOnRequestData = (
  isSameTrade: boolean,
  isDifferentTrades: boolean,
  isMultipleOperatives: boolean,
  requiredFollowOnTrades: string[],
  followOnTypeDescription: string,
  stockItemsRequired: boolean,
  nonStockItemsRequired: boolean,
  materialNotes: string,
  additionalNotes: string,
  supervisorCalled: boolean,
  estimatedDuration: string,
  otherTrade?: string,
): followOnDataRequest => {
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
    supervisorCalled,
    estimatedDuration,
    otherTrade,
  }
}

const operativesAndPercentagesForNotes = (
  operativesWithPercentages: operativeWithPercentage[],
  showPercentages: boolean = true
): string => {
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
  notes: string,
  operativesWithPercentages: operativeWithPercentage[],
  paymentType: string
): string => {
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
