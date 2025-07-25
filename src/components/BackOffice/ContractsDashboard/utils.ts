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
    return (
      new Date(contract.terminationDate) > baseComparisonDate &&
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

export const filterRelevantContracts = (
  contracts: Contract[],
  year: string
) => {
  const relevantContracts = contracts?.filter((c) => c.terminationDate > year)

  return relevantContracts
}

export const mapContractorNamesAndReferences = (
  contractorNames: Set<string>,
  contractorReferences: Set<string>
) => {
  const contractorNamesAndReferences = [...contractorNames].map(
    (name, index) => ({
      contractorName: name,
      contractorReference: [...contractorReferences][index],
    })
  )

  return contractorNamesAndReferences
}

export const sortContractorNamesAndReferencesByContractorName = (
  contractorNamesAndReferences: {
    contractorName: string
    contractorReference: string
  }[]
) => {
  const sortedAlphabeticallyByContractorName = contractorNamesAndReferences.sort(
    (a, b) => a.contractorName.localeCompare(b.contractorName)
  )

  return sortedAlphabeticallyByContractorName
}
