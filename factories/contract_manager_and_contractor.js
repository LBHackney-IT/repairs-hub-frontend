import { Factory } from 'fishery'

const contractManagerAndContractorUserFactory = Factory.define(() => ({
  name: 'A DLO Contract Manager',
  email: 'a.dlo_contract_manager@hackney.gov.uk',
  roles: ['dlo_contract_manager'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: true,
  hasContractManagerPermissions: true,
  hasAuthorisationManagerPermissions: false,
  hasOperativePermissions: false,
  hasAnyPermissions: true,
}))

export const contractManagerAndContractor =
  contractManagerAndContractorUserFactory.build()
