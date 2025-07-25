import { formatBudgetCode } from '@/utils/helpers/budgetCodes'
import { BudgetCode as BudgetCodeType } from '../../models/budgetCode'

interface Props {
  budgetCode: BudgetCodeType
}

const BudgetCode = ({ budgetCode }: Props) => {
  if (!budgetCode) return null

  return (
    <p className="govuk-body govuk-!-margin-bottom-0 lbh-!-font-weight-bold">
      Budget code – Subjective:
      <br />
      {formatBudgetCode(budgetCode)}
    </p>
  )
}

export default BudgetCode
