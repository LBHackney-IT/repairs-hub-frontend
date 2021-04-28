import CancelWorkOrderPage from 'src/pages/work-orders/[id]/cancel'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'

describe('CancelWorkOrderPage.permittedRoles', () => {
  ;[AGENT_ROLE, AUTHORISATION_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(CancelWorkOrderPage.permittedRoles).toContain(role)
    })
  })
  ;[CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(CancelWorkOrderPage.permittedRoles).not.toContain(role)
    })
  })
})
