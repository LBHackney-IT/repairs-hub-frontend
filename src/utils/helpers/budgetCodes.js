export const formatBudgetCodeForOption = (
  budgetCode,
  contractorIsPurdy,
  separator = ' - '
) => {
  const displayFields = [
    budgetCode?.externalCostCode,
    budgetCode?.corporateSubjectiveCode,
    budgetCode?.descriptionOfWorks,
  ]

  if (!contractorIsPurdy) displayFields.push(budgetCode?.contractorList)

  return displayFields.filter((x) => x).join(separator)
}

export const formatBudgetCode = (budgetCode) => {
  const displayFields = [
    budgetCode?.externalCostCode,
    [budgetCode?.corporateSubjectiveCode, budgetCode?.descriptionOfWorks]
      .filter((x) => x)
      .join(' '),
  ]

  return displayFields.filter((x) => x).join(' - ')
}
