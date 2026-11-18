import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const contractorUserFactory = Factory.define<User>(
  () =>
    (({
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      roles: ['contractor'],
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasOperativePermissions: false,
      hasAnyPermissions: true,
    } as unknown) as User)
)

export const contractor = contractorUserFactory.build()
