export const buildUpdateJob = (existingTasks, addedTasks, reference) => {
  const allTasks = [...existingTasks, ...addedTasks]
  return {
    relatedWorkOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    typeCode: 8,
    moreSpecificSORCode: {
      rateScheduleItem: allTasks.map((task) => {
        let codeAndName = task.code.split(' - ')
        let showDescription = task.description && task.description.length > 0
        return {
          customCode: codeAndName[0],
          customName: showDescription ? task.description : codeAndName[1],
          quantity: {
            amount: [Number.parseInt(task.quantity)],
          },
        }
      }),
    },
  }
}
