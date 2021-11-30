import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from 'src/utils/user'
import OperativeWorkOrderClosePage from '../../../../../src/pages/operatives/[operativeId]/work-orders/[id]/close'

describe('OperativeWorkOrderClosePage.permittedRoles', () => {
  ;[OPERATIVE_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(OperativeWorkOrderClosePage.permittedRoles).toContain(role)
    })
  })
  ;[
    AGENT_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
  ].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(OperativeWorkOrderClosePage.permittedRoles).not.toContain(role)
    })
  })
})
