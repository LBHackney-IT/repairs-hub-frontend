interface WorkOrderOperative {
  name: string
  jobPercentage: number
}

const generateMessage = (
  userComments: string,
  completionDate: Date | null,
  operativesWithPercentages: WorkOrderOperative[],
  paymentType: string,
  requiresApprovalToComplete: boolean = false
): string => {
  let note = requiresApprovalToComplete
    ? 'Closed - Completion pending approval'
    : 'Closed - Completed'

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
    const operativesWithPercentagesValue = formatOperatives(
      operativesWithPercentages,
      showPercentage
    )

    note += ` - Assigned operatives ${operativesWithPercentagesValue}`
  }

  // Pending approval work orders are not in bonus calculation until approved
  if (paymentType && !requiresApprovalToComplete) {
    note += ` - ${formatPaymentType(paymentType)}`
  }

  return note
}

const paymentTypeMessaging: { [key: string]: string } = {
  Bonus: 'Bonus calculation',
  Overtime: 'Overtime work order (SMVs not included in Bonus)',
  CloseToBase: 'Close to base (Operative payment made)',
}

const formatPaymentType = (paymentType: string): string => {
  if (Object.prototype.hasOwnProperty.call(paymentTypeMessaging, paymentType))
    return paymentTypeMessaging[paymentType]
  return ''
}

const formatOperatives = (
  operativesWithPercentages: WorkOrderOperative[],
  showPercentages: boolean
): string => {
  return operativesWithPercentages
    .map((x) => (showPercentages ? `${x.name}: ${x.jobPercentage}%` : x.name))
    .join(', ')
}

export default generateMessage
