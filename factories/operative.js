import { Factory } from 'fishery'

export const operativeUserFactory = Factory.define(() => ({
  name: 'An Agent',
  email: 'an.agent@hackney.gov.uk',
  roles: ['operative'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: false,
  hasContractManagerPermissions: false,
  hasAuthorisationManagerPermissions: false,
  hasOperativePermissions: true,
  hasAnyPermissions: true,
}))

export const operative = operativeUserFactory.build()
