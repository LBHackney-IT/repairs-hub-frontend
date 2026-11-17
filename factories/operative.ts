import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const operativeUserFactory = Factory.define<User>(
  () =>
    (({
      name: 'An Operative',
      email: 'an.operative@hackney.gov.uk',
      roles: ['operative'],
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasOperativePermissions: true,
      hasAnyPermissions: true,
    } as unknown) as User)
)

export const operative = operativeUserFactory.build()
