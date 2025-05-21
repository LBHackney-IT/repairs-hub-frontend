import { formatBudgetCode } from '@/utils/helpers/budgetCodes'

const BudgetCode = ({ budgetCode }) => {
  if (!budgetCode) {
    return null
  }

  return (
    <p className="govuk-body govuk-!-margin-bottom-0 lbh-!-font-weight-bold">
      Budget code – Subjective:
      <br />
      {formatBudgetCode(budgetCode)}
    </p>
  )
}

export default BudgetCode
