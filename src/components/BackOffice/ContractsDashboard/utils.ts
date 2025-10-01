import Contract from '@/root/src/models/contract'

export const today = new Date()

export function monthsOffset(months: number, baseComparisonDate: Date) {
  return new Date(
    baseComparisonDate.getFullYear(),
    baseComparisonDate.getMonth() + months,
    baseComparisonDate.getDate()
  )
}

export const filterActiveContractsByExpiryDate = (
  contracts: Contract[],
  months: number,
  baseComparisonDate: Date
) => {
  const contractExpiryCutOffDate = monthsOffset(months, baseComparisonDate)

  const filteredContracts = contracts?.filter((contract) => {
    return (
      new Date(contract.terminationDate) > baseComparisonDate &&
      new Date(contract.terminationDate) < contractExpiryCutOffDate
    )
  })
  return filteredContracts
}

export const filterInactiveContractsByExpiryDate = (
  contracts: Contract[],
  months: number,
  baseComparisonDate: Date
) => {
  const contractExpiryCutOffDate = monthsOffset(months, baseComparisonDate)

  const filteredContracts = contracts?.filter((contract) => {
    return (
      new Date(contract.terminationDate) < baseComparisonDate &&
      new Date(contract.terminationDate) > contractExpiryCutOffDate
    )
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
