import CautionaryContactPage from 'src/pages/work-orders/cautionary-contact'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from 'src/utils/user'

describe('CautionaryContactPage.permittedRoles', () => {
  ;[OPERATIVE_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(CautionaryContactPage.permittedRoles).toContain(role)
    })
  })
  ;[
    AGENT_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
  ].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(CautionaryContactPage.permittedRoles).not.toContain(role)
    })
  })
})
