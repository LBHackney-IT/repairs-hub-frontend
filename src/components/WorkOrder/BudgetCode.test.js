import { render } from '@testing-library/react'
import BudgetCode from './BudgetCode'

describe('BudgetCode component', () => {
  it('details the budget code', () => {
    const { asFragment } = render(
      <BudgetCode
        budgetCode={{
          externalCostCode: 'externalCostCode',
          corporateSubjectiveCode: 'corporateSubjectiveCode',
          descriptionOfWorks: 'descriptionOfWorks',
        }}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
