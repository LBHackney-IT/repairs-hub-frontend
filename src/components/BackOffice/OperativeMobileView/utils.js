export const filterOperatives = (operatives, operativeFilter) => {
  if (!operativeFilter) return operatives
  operativeFilter = operativeFilter.toLowerCase()
  return operatives.filter(
    (x) =>
      x.id?.toString().includes(operativeFilter) ||
      x.name?.toLowerCase().includes(operativeFilter) ||
      x.operativePayrollNumber?.toLowerCase().includes(operativeFilter)
  )
}
