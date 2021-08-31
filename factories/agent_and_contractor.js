import { Factory } from 'fishery'

export const agentAndContractorUserFactory = Factory.define(() => ({
  name: 'An Operative',
  email: 'an.operative@hackney.gov.uk',
  roles: ['agent', 'contractor'],
}))

export const agentAndContractor = agentAndContractorUserFactory.build()
