export const formatWorkOrderReferences = (workOrderReferences) => {
  return workOrderReferences
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => x)
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
