import { Factory } from 'fishery'

const authorisationManagerUserFactory = Factory.define(() => ({
  name: 'An Authorisation Manager',
  email: 'a.authorisation_manager@hackney.gov.uk',
  roles: ['authorisation_manager'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: false,
  hasContractManagerPermissions: false,
  hasAuthorisationManagerPermissions: true,
  hasOperativePermissions: false,
  hasBudgetCodeOfficerPermissions: false,
  hasAnyPermissions: true,
}))

export const authorisationManager = authorisationManagerUserFactory.build()
