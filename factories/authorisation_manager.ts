import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const authorisationManagerUserFactory = Factory.define<User>(
  () =>
    (({
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
    } as unknown) as User)
)

export const authorisationManager = authorisationManagerUserFactory.build()
