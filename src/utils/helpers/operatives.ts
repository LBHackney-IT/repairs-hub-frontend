import { Operative } from '../../models/operativeModel'

export const sortOperativesWithPayrollFirst = (
  operatives: Operative[],
  payrollNumber: string
) => {
  return operatives.sort((o1) => (o1.payrollNumber === payrollNumber ? -1 : 1))
}
