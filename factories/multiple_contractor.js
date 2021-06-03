import { Factory } from 'fishery'

export const multipleContractorUserFactory = Factory.define(() => ({
  name: 'Multiple Contractor',
  email: 'a.multiple-contractor@hackney.gov.uk',
  roles: ['contractor', 'contractor'],
  hasRole: true,
  hasAgentPermissions: false,
  hasContractorPermissions: true,
  hasContractManagerPermissions: false,
  hasAuthorisationManagerPermissions: false,
  hasAnyPermissions: true,
}))

export const multipleContractor = multipleContractorUserFactory.build()
