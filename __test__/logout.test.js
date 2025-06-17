import Logout from '../src/pages/logout'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '../src/utils/user'

describe('Logout.permittedRoles', () => {
  ;[
    AGENT_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    OPERATIVE_ROLE,
  ].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(Logout.permittedRoles).toContain(role)
    })
  })
})
