import { Factory } from 'fishery'

export const agentUserFactory = Factory.define(() => ({
  name: 'An Agent',
  email: 'an.agent@hackney.gov.uk',
  roles: ['agent'],
}))

export const agent = agentUserFactory.build()
