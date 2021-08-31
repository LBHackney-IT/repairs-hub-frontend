import { Factory } from 'fishery'

export const authorisationManagerAndContractorUserFactory = Factory.define(
  () => ({
    name: 'A DLO Supervisor',
    email: 'a.dlo_supervisor@hackney.gov.uk',
    roles: ['dlo_supervisor'],
  })
)

export const authorisationManagerAndContractor = authorisationManagerAndContractorUserFactory.build()
