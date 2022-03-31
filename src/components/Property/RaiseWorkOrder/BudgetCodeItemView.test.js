import { render } from '@testing-library/react'
import BudgetCodeItemView from './BudgetCodeItemView'

describe('BudgetCodeItemView component', () => {
  it('should render a datalist with formatted budget codes as options', () => {
    const { asFragment } = render(
      <BudgetCodeItemView
        budgetCodes={[
          {
            id: 1,
            externalCostCode: 'H2555',
            costCode: null,
            corporateSubjectiveCode: '200031',
            descriptionOfWorks: 'Lifts Breakdown',
          },
          {
            id: 2,
            externalCostCode: 'H2555',
            costCode: null,
            corporateSubjectiveCode: '200045',
            descriptionOfWorks: 'DPA Electrical Insp Planned',
          },
        ]}
        register={jest.fn()}
        disabled={false}
        loading={false}
        errors={{}}
        afterInvalidBudgetCodeSelected={jest.fn()}
        afterValidBudgetCodeSelected={jest.fn()}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
