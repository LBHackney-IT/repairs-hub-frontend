export const BONUS_PAYMENT_TYPE = 'Bonus'
export const OVERTIME_PAYMENT_TYPE = 'Overtime'
export const CLOSE_TO_BASE_PAYMENT_TYPE = 'CloseToBase'

// TODO: narrow to a union of the three payment types once callers hold
// typed values rather than plain strings
export type PaymentType = string

export const PAYMENT_TYPE_FORM_DESCRIPTIONS: Record<
  PaymentType,
  { text: string; hint?: string }
> = {
  [BONUS_PAYMENT_TYPE]: { text: 'Bonus calculation' },
  [OVERTIME_PAYMENT_TYPE]: {
    text: 'Overtime work order',
    hint: 'SMVs not included in Bonus',
  },
  [CLOSE_TO_BASE_PAYMENT_TYPE]: {
    text: 'Close to base',
    hint: 'Operative payment made',
  },
}

export const optionsForPaymentType = ({
  paymentTypes,
  currentPaymentType,
  defaultPaymentType = BONUS_PAYMENT_TYPE,
}: {
  paymentTypes: PaymentType[]
  currentPaymentType?: PaymentType
  defaultPaymentType?: PaymentType
}) => {
  return paymentTypes.map((paymentType) => {
    const paymentTypeTexts = PAYMENT_TYPE_FORM_DESCRIPTIONS[paymentType]

    return {
      text: paymentTypeTexts.text,
      value: paymentType,
      defaultChecked: currentPaymentType
        ? paymentType === currentPaymentType
        : paymentType === defaultPaymentType,
      hint: paymentTypeTexts.hint,
    }
  })
}

export const workOrderNoteFragmentForPaymentType = (
  paymentType?: PaymentType
): string => {
  if (!paymentType) {
    return ''
  }

  const paymentTypeText = PAYMENT_TYPE_FORM_DESCRIPTIONS[paymentType]

  return [
    paymentTypeText.text,
    ...(paymentTypeText.hint ? [`(${paymentTypeText.hint})`] : []),
  ].join(' ')
}
