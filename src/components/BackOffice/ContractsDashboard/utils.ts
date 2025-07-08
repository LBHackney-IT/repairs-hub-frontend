import Contract from '@/root/src/models/contract'

export const today = new Date()

export function monthsOffset(months: number) {
  return new Date(
    today.getFullYear(),
    today.getMonth() + months,
    today.getDate()
  )
}

export const filterContractsByExpiryDate = (
  contracts: Contract[],
  months: number
) => {
  const contractExpiryCutOffDate = monthsOffset(months)

  const filteredContracts = contracts?.filter((contract) => {
    return (
      new Date(contract.terminationDate) > today &&
      new Date(contract.terminationDate) < contractExpiryCutOffDate
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
