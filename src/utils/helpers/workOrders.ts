const DLO_REFERENCE_REGEX = /^H\d{2,}$/

export const isDLOContractorReference = (contractorReference) =>
  contractorReference && contractorReference.match(DLO_REFERENCE_REGEX)

export const isContractorScheduledInternally = isDLOContractorReference


