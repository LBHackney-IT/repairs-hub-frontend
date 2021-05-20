import { Factory } from 'fishery'

export const agentUserFactory = Factory.define(() => ({
  name: 'An Agent',
  email: 'an.agent@hackney.gov.uk',
  roles: ['agent'],
  hasRole: true,
  hasAgentPermissions: true,
  hasContractorPermissions: false,
  hasContractManagerPermissions: false,
  hasAuthorisationManagerPermissions: false,
  hasAnyPermissions: true,
}))

export const agent = agentUserFactory.build()
