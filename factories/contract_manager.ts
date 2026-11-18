import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const contractManagerUserFactory = Factory.define<User>(
  () =>
    (({
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
    } as unknown) as User)
)

export const contractManager = contractManagerUserFactory.build()
