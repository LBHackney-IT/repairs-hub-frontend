import { Factory } from 'fishery'

const dataAdminFactory = Factory.define(() => ({
  name: 'A Data Admin',
  email: 'a.data_admin@hackney.gov.uk',
  roles: ['data_admin'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: false,
  hasContractManagerPermissions: false,
  hasAuthorisationManagerPermissions: false,
  hasOperativePermissions: false,
  hasDataAdminPermissions: true,
  hasAnyPermissions: true,
}))

export const dataAdmin = dataAdminFactory.build()
