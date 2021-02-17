import Home from '../src/pages/index'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../src/utils/user'

describe('Home.permittedRoles', () => {
  ;[AGENT_ROLE, CONTRACTOR_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(Home.permittedRoles).toContain(role)
    })
  })
})
