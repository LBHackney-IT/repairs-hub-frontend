import SearchPage from 'src/pages/search'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '../src/utils/auth/user'

describe('SearchPage.permittedRoles', () => {
  ;[
    AGENT_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
    AUTHORISATION_MANAGER_ROLE,
  ].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(SearchPage.permittedRoles).toContain(role)
    })
  })
  ;[OPERATIVE_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(SearchPage.permittedRoles).not.toContain(role)
    })
  })
})
