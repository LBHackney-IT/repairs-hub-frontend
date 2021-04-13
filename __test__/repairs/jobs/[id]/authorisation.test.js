import AuthorisationPage from 'src/pages/repairs/jobs/[id]/authorisation'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from 'src/utils/user'

describe('AuthorisationPage.permittedRoles', () => {
  ;[CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(AuthorisationPage.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE, CONTRACTOR_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(AuthorisationPage.permittedRoles).not.toContain(role)
    })
  })
})
