import { Priority } from '@/root/src/models/priority'

export const isOutOfHoursGas = (
  contractorReference: string,
  tradeCode: string
) => {
  const gasBreakdownContractorReference = 'H04'
  const oohTradeCode = 'OO'

  if (contractorReference != gasBreakdownContractorReference) return false // contractor must be "H04"
  return tradeCode == oohTradeCode
}

export const getPriorityObjectByCode = (
  code: number,
  priorities: Priority[]
) => {
  return priorities.find((priority) => priority.priorityCode == code)
}
