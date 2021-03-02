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
