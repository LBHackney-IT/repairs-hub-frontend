import { Factory } from 'fishery'

export const multipleContractorUserFactory = Factory.define(() => ({
  name: 'Multiple Contractor',
  email: 'a.multiple-contractor@hackney.gov.uk',
  roles: ['contractor', 'contractor'],
}))

export const multipleContractor = multipleContractorUserFactory.build()
