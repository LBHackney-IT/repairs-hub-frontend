const DLO_REFERENCE_REGEX = /^H\d{2,}$/

export const isContractorScheduledInternally = (contractorReference) =>
  contractorReference && contractorReference.match(DLO_REFERENCE_REGEX)
