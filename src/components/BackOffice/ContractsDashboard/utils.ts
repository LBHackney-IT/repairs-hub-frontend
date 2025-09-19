import Contract from '@/root/src/models/contract'

export const today = new Date()

export function monthsOffset(months: number, baseComparisonDate: Date) {
  return new Date(
    baseComparisonDate.getFullYear(),
    baseComparisonDate.getMonth() + months,
    baseComparisonDate.getDate()
  )
}

export const filterContractsByExpiryDate = (
  contracts: Contract[],
  months: number,
  baseComparisonDate: Date
) => {
  const contractExpiryCutOffDate = monthsOffset(months, baseComparisonDate)

  const filteredContracts = contracts?.filter((contract) => {
    if (months > 0) {
      return (
        new Date(contract.terminationDate) > baseComparisonDate &&
        new Date(contract.terminationDate) < contractExpiryCutOffDate
      )
    }
    if (months < 0) {
      return (
        new Date(contract.terminationDate) < baseComparisonDate &&
        new Date(contract.terminationDate) > contractExpiryCutOffDate
      )
    }
  })
  return filteredContracts
}

export const filterRelativeInactiveContracts = (
  contracts: Contract[],
  yearAfter: string
) => {
  const relativeInactiveContracts = contracts?.filter(
    (contract) =>
      contract.terminationDate > yearAfter &&
      contract.terminationDate < new Date().toISOString()
  )
  return relativeInactiveContracts
}
