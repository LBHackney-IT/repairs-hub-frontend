import { Factory } from 'fishery'

export const authorisationManagerUserFactory = Factory.define(() => ({
  name: 'An Authorisation Manager',
  email: 'a.authorisation_manager@hackney.gov.uk',
  roles: ['authorisation_manager'],
}))

export const authorisationManager = authorisationManagerUserFactory.build()
