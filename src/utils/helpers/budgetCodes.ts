import { BudgetCode } from '../../models/budgetCodeModel'

export const formatBudgetCodeForOption = (
  budgetCode: BudgetCode,
  separator = ' - '
) =>
  [
    budgetCode?.externalCostCode,
    budgetCode?.corporateSubjectiveCode,
    budgetCode?.descriptionOfWorks,
  ]
    .filter((x) => x)
    .join(separator)

export const formatBudgetCode = (budgetCode: BudgetCode) =>
  [
    budgetCode?.externalCostCode,
    [budgetCode?.corporateSubjectiveCode, budgetCode?.descriptionOfWorks]
      .filter((x) => x)
      .join(' '),
  ]
    .filter((x) => x)
    .join(' - ')
