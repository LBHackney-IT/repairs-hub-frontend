type TaskWithQuantity = {
  id: string
  quantity?: number | string
}

// Mutates the matching tasks in place. The returned array only contains
// the new quantity for tasks that matched (undefined otherwise).
export const updateExistingTasksQuantities = (
  e: Record<string, any>,
  existingTasks: TaskWithQuantity[]
) => {
  return existingTasks.map((task, index) => {
    if (e[`original-rate-schedule-item-${index}`] === task.id) {
      return (task.quantity = e[`quantity-${index}`])
    }
  })
}
