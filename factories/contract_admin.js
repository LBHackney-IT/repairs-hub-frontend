import { Factory } from 'fishery'

const contractAdminFactory = Factory.define(() => ({
  name: 'A Contract Admin',
  email: 'a.contract_admin@hackney.gov.uk',
  roles: ['contract_admin'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: false,
  hasContractManagerPermissions: false,
  hasAuthorisationManagerPermissions: false,
  hasOperativePermissions: false,
  hasDataAdminPermissions: false,
  hasContractAdminPermissions: true,
  hasAnyPermissions: true,
}))

export const contractAdmin = contractAdminFactory.build()
