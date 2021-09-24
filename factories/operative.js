import { Factory } from 'fishery'

const operativeUserFactory = Factory.define(() => ({
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
}))

export const operative = operativeUserFactory.build()
