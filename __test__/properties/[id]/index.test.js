import PropertyPage from 'src/pages/properties/[id]'
import { CONTRACTOR_ROLE, AGENT_ROLE } from 'src/utils/user'

describe('PropertyPage.permittedRoles', () => {
  ;[AGENT_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(PropertyPage.permittedRoles).toContain(role)
    })
  })
  ;[CONTRACTOR_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(PropertyPage.permittedRoles).not.toContain(role)
    })
  })
})
