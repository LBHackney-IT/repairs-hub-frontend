import { Factory } from 'fishery'

export const agentAndContractorUserFactory = Factory.define(() => ({
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
}))

export const agentAndContractor = agentAndContractorUserFactory.build()
