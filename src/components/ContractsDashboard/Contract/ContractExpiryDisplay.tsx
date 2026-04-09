import Contract from '@/root/src/models/contract'
import { dateToStr } from '@/root/src/utils/date'

interface ContractExpiryDisplayProps {
  contract: Contract
  page: string
}

export const dateDiffRoundedUp = (contract: Contract) => {
  const todayTimestamp = new Date().getTime()

  const contractTerminationTimeStamp = new Date(
    contract.terminationDate
  ).getTime()
  const diffTime = Math.abs(todayTimestamp - contractTerminationTimeStamp)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
