import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'

export const saveContractChangesToDatabase = async (data) => {
  await frontEndApiRequest({
    method: 'POST',
    path: `/api/backOffice/sor-contracts`,
    requestData: data,
  })
}

export const validatePropertyReference = (propertyReference) => {
  const regex = /^\d{8}$/gm
  return regex.exec(propertyReference) !== null
}

export const copyContractsSelected = (selectedOption) => {
  return selectedOption === 'Copy'
}

export const addContractsSelected = (selectedOption) => {
  return selectedOption === 'Add'
}

const sanitizeInput = (value) => {
  return value.trim().replace(/ /g, '')
}

export const dataToRequestObject = (
  sourcePropertyReference,
  destinationPropertyReference,
  selectedContract,
  selectedOption
) => {
  return {
    sourcePropertyReference: sanitizeInput(sourcePropertyReference),
    destinationPropertyReference: sanitizeInput(destinationPropertyReference),
    contractReference: selectedContract,
    mode: selectedOption,
  }
}

export const propertyReferencesMatch = (
  propertyReference1,
  propertyReference2
) => {
  if (!propertyReference1 || !propertyReference2) return false

  return sanitizeInput(propertyReference1) === sanitizeInput(propertyReference2)
}
