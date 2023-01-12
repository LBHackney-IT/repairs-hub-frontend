import { Factory } from 'fishery'

const dataAdminFactory = Factory.define(() => ({
  name: 'A Data Admin',
  email: 'a.data.admin@hackney.gov.uk',
  roles: ['dataAdmin'],
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
