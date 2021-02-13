export const updatedTasks = (e, numberOfExistingTasks) => {
  return [...Array(numberOfExistingTasks).keys()].map((index) => {
    return {
      code: e[`hidden-sor-code-${index}`],
      cost: e[`cost-${index}`],
      quantity: e[`quantity-${index}`],
    }
  })
}
