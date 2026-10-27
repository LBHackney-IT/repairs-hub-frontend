export const formatWorkOrderReferences = (workOrderReferences: string) => {
  return [
    ...new Set(
      workOrderReferences
        .split('\n')
        .map((x) => x.trim())
        .filter((x) => x)
    ),
  ]
}

const validateWorkOrderReference = (workOrderReference: string) => {
  const regex = /^\d{8}$/gm

  return regex.exec(workOrderReference) !== null
}

export const getInvalidWorkOrderReferences = (
  workOrderReferences: string[]
) => {
  return workOrderReferences
    .filter((x) => !validateWorkOrderReference(x))
    .map((x) => `"${x}"`)
}

export const formatInvalidWorkOrderReferencesError = (
  invalidWorkOrderReferences: string[]
) => {
  return `Invalid WorkOrder Reference(s) entered: ${invalidWorkOrderReferences.join(
    ', '
  )}`
}

export const dateIsInFuture = (date: number | Date) => {
  const today = new Date()

  return date > today
}
