import { Factory } from 'fishery'
import { User } from '@/components/UserContext'

// The fake users only carry the fields tests need, so cast them to the real
// `User` type that UserContext expects
const authorisationManagerAndContractorUserFactory = Factory.define<User>(
  () =>
    (({
      name: 'A DLO Supervisor',
      email: 'a.dlo_supervisor@hackney.gov.uk',
      roles: ['dlo_supervisor'],
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: true,
      hasOperativePermissions: false,
      hasAnyPermissions: true,
    } as unknown) as User)
)

export const authorisationManagerAndContractor = authorisationManagerAndContractorUserFactory.build()
