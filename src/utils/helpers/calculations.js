// rename this function to something like : calculateTotal,
// since we use it to calculate total cost and total SMV 
export const calculateTotalCost = (
  arrayOfObjects,
  costAttribute,
  quantityAttribute
) => {
  return arrayOfObjects.reduce((prev, cur) => {
    return (
      prev + parseFloat(cur[costAttribute]) * parseFloat(cur[quantityAttribute])
    )
  }, 0)
}

export const calculateCostBeforeVariation = (tasks) => {
  return tasks.reduce((acc, task) => {
    let cost = task.unitCost ? task.unitCost : 0
    return acc + cost * task.currentQuantity
  }, 0)
}

export const calculateChangeInCost = (tasks) => {
  return tasks.reduce((acc, task) => {
    let cost = task.unitCost ? task.unitCost : 0
    return acc + (task.variedQuantity - task.currentQuantity) * cost
  }, 0)
}

export const calculateTotalVariedCost = (tasks) => {
  return tasks.reduce((acc, task) => {
    let cost = task.unitCost ? task.unitCost : 0
    return acc + task.variedQuantity * cost
  }, 0)
}
