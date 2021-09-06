export const areTasksUpdated = (tasks) => {
  const originalQuantityIsEqualToCurrentQuantity = (task) =>
    task.originalQuantity === task.quantity
  return !tasks.every(originalQuantityIsEqualToCurrentQuantity)
}
