type TaskWithQuantities = {
  originalQuantity?: number
  quantity: number
}

export const areTasksUpdated = (tasks: TaskWithQuantities[]): boolean => {
  const originalQuantityIsEqualToCurrentQuantity = (task: TaskWithQuantities) =>
    task.originalQuantity === task.quantity
  return !tasks.every(originalQuantityIsEqualToCurrentQuantity)
}
