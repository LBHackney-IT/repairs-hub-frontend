export const buildVariationFormData = (
  latestTasks,
  addedTasks,
  reference,
  variationReason
) => {
  const buildRateScheduleItems = (tasks, existing = false) => {
    return tasks.map((task) => {
      return {
        // We need to send back up the id for existing rate schedule items
        ...(existing && { id: task.id }),
        customCode: task.code.split(' - ')[0],
        customName: task.description,
        quantity: {
          amount: [Number.parseFloat(task.quantity)],
        },
      }
    })
  }

  const rateScheduleItems = [
    ...buildRateScheduleItems(latestTasks, true),
    ...buildRateScheduleItems(addedTasks),
  ]

  return {
    relatedWorkOrderReference: {
      id: reference,
    },
    ...(variationReason &&
      variationReason.length && {
        comments: variationReason,
      }),
    // From HACT JobStatusUpdateTypeCode:
    // 80 - More specific SOR codes identified
    typeCode: '80',
    moreSpecificSORCode: {
      rateScheduleItem: rateScheduleItems,
    },
  }
}
