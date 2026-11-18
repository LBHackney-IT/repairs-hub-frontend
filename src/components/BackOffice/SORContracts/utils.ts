import type {
  SorContractsMode,
  SorContractsRequest,
} from '@/requests/backOffice/sorContracts'

export const validatePropertyReference = (propertyReference: string) => {
  const regex = /^\d{8}$/gm
  return regex.exec(propertyReference) !== null
}

export const copyContractsSelected = (selectedOption: SorContractsMode) => {
  return selectedOption === 'Copy'
}

export const addContractsSelected = (selectedOption: SorContractsMode) => {
  return selectedOption === 'Add'
}

const sanitizeInput = (value: string) => {
  return value.trim().replace(/ /g, '')
}

export const dataToRequestObject = (
  sourcePropertyReference: string,
  destinationPropertyReference: string,
  selectedContract: string,
  selectedOption: SorContractsMode
): SorContractsRequest => {
  return {
    sourcePropertyReference: sanitizeInput(sourcePropertyReference),
    destinationPropertyReference: sanitizeInput(destinationPropertyReference),
    contractReference: selectedContract,
    mode: selectedOption,
  }
}

export const propertyReferencesMatch = (
  propertyReference1: string,
  propertyReference2: string
) => {
  if (!propertyReference1 || !propertyReference2) return false

  return sanitizeInput(propertyReference1) === sanitizeInput(propertyReference2)
}
