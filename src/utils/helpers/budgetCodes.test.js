import { formatBudgetCode, formatBudgetCodeForOption } from './budgetCodes'

describe('formatBudgetCodeForOption', () => {
  it('includes the externalCostCode, corporateSubjectiveCode and descriptionOfWorks', () => {
    expect(
      formatBudgetCodeForOption({
        externalCostCode: 'costCode',
        corporateSubjectiveCode: 'subjectiveCode',
        descriptionOfWorks: 'description',
      })
    ).toEqual('costCode - subjectiveCode - description')
  })
})

describe('formatBudgetCode', () => {
  it('includes the externalCostCode, corporateSubjectiveCode and descriptionOfWorks', () => {
    expect(
      formatBudgetCode({
        externalCostCode: 'costCode',
        corporateSubjectiveCode: 'subjectiveCode',
        descriptionOfWorks: 'description',
      })
    ).toEqual('costCode - subjectiveCode description')
  })
})
