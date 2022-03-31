export const formatBudgetCodeForOption = (budgetCode, separator = ' - ') =>
  [
    budgetCode?.externalCostCode,
    budgetCode?.corporateSubjectiveCode,
    budgetCode?.descriptionOfWorks,
  ]
    .filter((x) => x)
    .join(separator)

export const formatBudgetCode = (budgetCode) =>
  [
    budgetCode?.externalCostCode,
    [budgetCode?.corporateSubjectiveCode, budgetCode?.descriptionOfWorks]
      .filter((x) => x)
      .join(' '),
  ]
    .filter((x) => x)
    .join(' - ')
