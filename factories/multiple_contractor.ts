import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const multipleContractorUserFactory = Factory.define<User>(
  () =>
    (({
      name: 'Multiple Contractor',
      email: 'a.multiple-contractor@hackney.gov.uk',
      roles: ['contractor', 'contractor'],
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasOperativePermissions: false,
      hasAnyPermissions: true,
    } as unknown) as User)
)

export const multipleContractor = multipleContractorUserFactory.build()
