export const updateExistingTasksQuantities = (e, existingTasks) => {
  return existingTasks.map((task, index) => {
    if (e[`original-rate-schedule-item-${index}`] === task.id) {
      return (task.quantity = e[`quantity-${index}`])
    }
  })
}
