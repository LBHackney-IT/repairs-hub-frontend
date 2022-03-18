import { formatBudgetCode } from './budgetCodes'

describe('formatBudgetCode', () => {
  it('includes the externalCostCode, corporateSubjectiveCode and descriptionOfWorks', () => {
    expect(
      formatBudgetCode({
        externalCostCode: 'costCode',
        corporateSubjectiveCode: 'subjectiveCode',
        descriptionOfWorks: 'description',
      })
    ).toEqual('costCode - subjectiveCode - description')
  })
})
