import { Factory } from 'fishery'

export const contractManagerAndContractorUserFactory = Factory.define(() => ({
  name: 'A DLO Contract Manager',
  email: 'a.dlo_contract_manager@hackney.gov.uk',
  roles: ['dlo_contract_manager'],
}))

export const contractManagerAndContractor = contractManagerAndContractorUserFactory.build()
