import { Factory } from 'fishery'

const contractorUserFactory = Factory.define(() => ({
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
}))

export const contractor = contractorUserFactory.build()
