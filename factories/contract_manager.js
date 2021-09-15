import { Factory } from 'fishery'

const contractManagerUserFactory = Factory.define(() => ({
  name: 'A Contract Manager',
  email: 'a.contract_manager@hackney.gov.uk',
  roles: ['contract_manager'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: false,
  hasContractManagerPermissions: true,
  hasAuthorisationManagerPermissions: false,
  hasOperativePermissions: false,
  hasAnyPermissions: true,
}))

export const contractManager = contractManagerUserFactory.build()
