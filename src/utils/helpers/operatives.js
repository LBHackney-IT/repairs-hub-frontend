export const sortOperativesWithPayrollFirst = (operatives, payrollNumber) => {
  return operatives.sort((o1) => (o1.payrollNumber === payrollNumber ? -1 : 1))
}
