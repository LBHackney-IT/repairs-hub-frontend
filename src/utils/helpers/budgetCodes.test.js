import { formatBudgetCode, formatBudgetCodeForOption } from './budgetCodes'

describe('formatBudgetCodeForOption', () => {
  const budgetCode = {
    externalCostCode: 'costCode',
    corporateSubjectiveCode: 'subjectiveCode',
    descriptionOfWorks: 'description',
    contractorsList: 'H01, H02'
  };

  it('includes the externalCostCode, corporateSubjectiveCode, descriptionOfWorks, and contractorsList', () => {
    expect(
      formatBudgetCodeForOption(budgetCode)
    ).toEqual('costCode - subjectiveCode - description - H01, H02')
  })

  it('doesnt include contractorsList when contractor is Purdy', () => {
    expect(
      formatBudgetCodeForOption(budgetCode, true)
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
