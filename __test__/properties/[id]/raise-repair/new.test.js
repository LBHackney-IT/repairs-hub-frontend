import RaiseRepairPage from 'src/pages/properties/[id]/raise-repair/new'
import { AGENT_ROLE, CONTRACTOR_ROLE } from 'src/utils/user'

describe('RaiseRepairPage.permittedRoles', () => {
  ;[AGENT_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(RaiseRepairPage.permittedRoles).toContain(role)
    })
  })
  ;[CONTRACTOR_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(RaiseRepairPage.permittedRoles).not.toContain(role)
    })
  })
})
