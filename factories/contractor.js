import { Factory } from 'fishery'

export const contractorUserFactory = Factory.define(() => ({
  name: 'A Contractor',
  email: 'a.contractor@hackney.gov.uk',
  roles: ['contractor'],
}))

export const contractor = contractorUserFactory.build()
