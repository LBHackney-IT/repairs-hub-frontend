import CautionaryAlertsPage from 'src/pages/work-orders/cautionary-alerts'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/auth/user'

describe('CautionaryAlertsPage.permittedRoles', () => {
  ;[OPERATIVE_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(CautionaryAlertsPage.permittedRoles).toContain(role)
    })
  })
  ;[
    AGENT_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
  ].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(CautionaryAlertsPage.permittedRoles).not.toContain(role)
    })
  })
})
