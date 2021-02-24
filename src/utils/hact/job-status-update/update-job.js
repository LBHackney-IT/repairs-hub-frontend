export const buildUpdateJob = (existingTasks, addedTasks, reference) => {
  const buildRateScheduleItems = (tasks, existing = false) => {
    return tasks.map((task) => {
      return {
        // We need to send back up the id for existing rate schedule items
        ...(existing && { id: task.id }),
        customCode: task.code.split(' - ')[0],
        customName: task.description,
        quantity: {
          amount: [Number.parseInt(task.quantity)],
        },
      }
    })
  }

  const rateScheduleItems = [
    ...buildRateScheduleItems(existingTasks, true),
    ...buildRateScheduleItems(addedTasks),
  ]

  return {
    relatedWorkOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    typeCode: 8,
    moreSpecificSORCode: {
      rateScheduleItem: rateScheduleItems,
    },
  }
}
