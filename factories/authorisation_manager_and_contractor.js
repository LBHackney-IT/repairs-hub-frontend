import { Factory } from 'fishery'

const authorisationManagerAndContractorUserFactory = Factory.define(() => ({
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
}))

export const authorisationManagerAndContractor =
  authorisationManagerAndContractorUserFactory.build()
