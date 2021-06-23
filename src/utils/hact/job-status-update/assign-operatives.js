import { uniqueArrayValues } from '../../helpers/array'

export const buildOperativeAssignmentFormData = (
  workOrderReference,
  operatives
) => {
  const operativeIds = operatives.map((operative) => operative.id)

  const deduplicatedOperatives = uniqueArrayValues(
    operativeIds
  ).map((operativeId) =>
    operatives.find((operative) => operative.id === operativeId)
  )

  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    comments: `Assigned ${deduplicatedOperatives
      .map((operative) => operative.name)
      .join(', ')}`,
    operativesAssigned: deduplicatedOperatives.map((operative) => ({
      identification: {
        number: operative.id,
      },
    })),
    typeCode: '10',
  }
}
