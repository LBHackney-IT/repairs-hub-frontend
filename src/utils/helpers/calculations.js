export const calculateTotal = (
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

export const strippingZeroes = (number) => {
  return number.replace(/\.00$/, '')
}

export const calculateSMV = (percentage, totalSMV) => {
  return percentage === '-'
    ? '-'
    : strippingZeroes(
        (parseFloat(percentage.split('%')[0]) * 0.01 * totalSMV).toFixed(2)
      )
}
