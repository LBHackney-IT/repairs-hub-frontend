import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from 'src/utils/user'
import OperativeWorkOrderPage from '@/pages/operatives/[operativeId]/work-orders/[id]'

describe('OperativeWorkOrderPage.permittedRoles', () => {
  ;[OPERATIVE_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(OperativeWorkOrderPage.permittedRoles).toContain(role)
    })
  })
  ;[
    AGENT_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
  ].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(OperativeWorkOrderPage.permittedRoles).not.toContain(role)
    })
  })
})
