import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const agentUserFactory = Factory.define<User>(
  () =>
    (({
      name: 'An Agent',
      email: 'an.agent@hackney.gov.uk',
      roles: ['agent'],
      hasRole: true,
      hasAgentPermissions: true,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasOperativePermissions: false,
      hasBudgetCodeOfficerPermissions: true,
      hasAnyPermissions: true,
    } as unknown) as User)
)

export const agent = agentUserFactory.build()
