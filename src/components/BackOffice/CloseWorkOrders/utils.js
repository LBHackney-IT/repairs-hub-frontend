export const formatWorkOrderReferences = (workOrderReferences) => {
  return [
    ...new Set(
      workOrderReferences
        .split('\n')
        .map((x) => x.trim())
        .filter((x) => x)
    ),
  ]
}

const validateWorkOrderReference = (workOrderReference) => {
  const regex = /^\d{8}$/gm

  return regex.exec(workOrderReference) !== null
}

export const getInvalidWorkOrderReferences = (workOrderReferences) => {
  return workOrderReferences
    .filter((x) => !validateWorkOrderReference(x))
    .map((x) => `"${x}"`)
}

export const formatInvalidWorkOrderReferencesError = (
  invalidWorkOrderReferences
) => {
  return `Invalid WorkOrder Reference(s) entered: ${invalidWorkOrderReferences.join(
    ', '
  )}`
}

export const dateIsInFuture = (date) => {
  const today = new Date()

  return date > today
}
