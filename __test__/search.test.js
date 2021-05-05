import SearchPage from 'src/pages/search'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from 'src/utils/user'
import { AUTHORISATION_MANAGER_ROLE } from '../src/utils/user'

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
})
