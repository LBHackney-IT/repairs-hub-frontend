import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const agentAndContractorUserFactory = Factory.define<User>(
  () =>
    (({
      name: 'An Operative',
      email: 'an.operative@hackney.gov.uk',
      roles: ['agent', 'contractor'],
      hasRole: true,
      hasAgentPermissions: true,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasOperativePermissions: false,
      hasAnyPermissions: true,
    } as unknown) as User)
)

export const agentAndContractor = agentAndContractorUserFactory.build()
