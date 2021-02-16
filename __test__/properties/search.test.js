import SearchPage from 'src/pages/properties/search'
import { AGENT_ROLE, CONTRACTOR_ROLE } from 'src/utils/user'

describe('SearchPage.permittedRoles', () => {
  ;[AGENT_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(SearchPage.permittedRoles).toContain(role)
    })
  })
  ;[CONTRACTOR_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(SearchPage.permittedRoles).not.toContain(role)
    })
  })
})
