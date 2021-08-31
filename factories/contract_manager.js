import { Factory } from 'fishery'

export const contractManagerUserFactory = Factory.define(() => ({
  name: 'A Contract Manager',
  email: 'a.contract_manager@hackney.gov.uk',
  roles: ['contract_manager'],
}))

export const contractManager = contractManagerUserFactory.build()
