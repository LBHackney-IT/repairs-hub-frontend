export const BONUS_PAYMENT_TYPE = 'Bonus'
export const OVERTIME_PAYMENT_TYPE = 'Overtime'
export const CLOSE_TO_BASE_PAYMENT_TYPE = 'CloseToBase'

export const PAYMENT_TYPE_FORM_DESCRIPTIONS = {
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

export const workOrderNoteFragmentForPaymentType = (paymentType) => {
  if (!paymentType) {
    return ''
  }

  const paymentTypeText = PAYMENT_TYPE_FORM_DESCRIPTIONS[paymentType]

  return [
    paymentTypeText.text,
    ...(paymentTypeText.hint ? [`(${paymentTypeText.hint})`] : []),
  ].join(' ')
}
