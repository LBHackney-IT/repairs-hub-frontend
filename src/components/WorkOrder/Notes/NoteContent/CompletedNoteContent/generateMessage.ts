import { Note } from '../../types'

type PaymentType = 'Bonus' | 'Overtime' | 'CloseToBase' | null

interface WorkOrderOperative {
  name: string
  jobPercentage: number
}

const generateMessage = (
  userComments: string,
  completionDate: Date | null,
  operativesWithPercentages: WorkOrderOperative[],
  paymentType: PaymentType
): string => {
  let note = 'Closed - Completed'

  if (completionDate) {
    note += `: ${completionDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  if (userComments?.trim()) {
    note += ` - ${userComments.trim()}`
  }

  if (operativesWithPercentages.length > 0) {
    const showPercentage = paymentType !== 'Overtime'
    const operativesWithPercentagesValue = operativesAndPercentagesForNotes(
      operativesWithPercentages,
      showPercentage
    )

    note += ` - Assigned operatives ${operativesWithPercentagesValue}`
  }

  if (paymentType) {
    note += ` - ${workOrderNoteFragmentForPaymentType(paymentType)}`
  }

  return note
}

const workOrderNoteFragmentForPaymentType = (
  paymentType: PaymentType
): string => {
  switch (paymentType) {
    case 'Bonus':
      return 'Bonus calculation'
    case 'Overtime':
      return 'Overtime work order (SMVs not included in Bonus)'
    case 'CloseToBase':
      return 'Close to base (Operative payment made)'
    default:
      return ''
  }
}

const operativesAndPercentagesForNotes = (
  operativesWithPercentages: WorkOrderOperative[],
  showPercentages: boolean
): string => {
  return operativesWithPercentages
    .map((x) => (showPercentages ? `${x.name}: ${x.jobPercentage}%` : x.name))
    .join(', ')
}

export default generateMessage
