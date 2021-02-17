import WorkOrderPage from 'src/pages/work-orders/[id]'
import { AGENT_ROLE, CONTRACTOR_ROLE } from 'src/utils/user'

describe('WorkOrderPage.permittedRoles', () => {
  ;[AGENT_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(WorkOrderPage.permittedRoles).toContain(role)
    })
  })
  ;[CONTRACTOR_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(WorkOrderPage.permittedRoles).not.toContain(role)
    })
  })
})
