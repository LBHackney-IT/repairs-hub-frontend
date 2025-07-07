import Contract from "@/root/src/models/contract"

export const today = new Date()

export const twoMonthsago = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    today.getDate()
)

export const oneMonthInTheFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate()
)

export const twoMonthsInTheFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 2,
  today.getDate()
)

export const sixMonthsInTheFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 6,
  today.getDate()
)

export const filterContractsByExpiryDate = (contracts: Contract[], months: number) => { 
    const contractExpiryCutOffDate = new Date(
        today.getFullYear(),
        today.getMonth() + months,
        today.getDate()
    )
    const filteredContracts = contracts?.filter((contract) => {
    return (
      new Date(contract.terminationDate) > today &&
      new Date(contract.terminationDate) < contractExpiryCutOffDate
    )
  })
  return filteredContracts
}

export const filterRelativeInactiveContracts = (contracts: Contract[], yearAfter: string) =>  { 
    const relativeInactiveContracts = contracts?.filter(
    (contract) =>
      contract.terminationDate > yearAfter &&
      contract.terminationDate < new Date().toISOString()
  )
  return relativeInactiveContracts
}