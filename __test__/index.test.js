import Home from '../src/pages/index'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../src/models/user'

describe('Home.permittedRoles', () => {
  ;[
    AGENT_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
    AUTHORISATION_MANAGER_ROLE,
  ].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(Home.permittedRoles).toContain(role)
    })
  })
})
