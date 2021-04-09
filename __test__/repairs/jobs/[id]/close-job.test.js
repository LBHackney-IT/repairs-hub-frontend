import CloseJobPage from 'src/pages/repairs/jobs/[id]/close-job'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from 'src/utils/user'

describe('CloseJobPage.permittedRoles', () => {
  ;[CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(CloseJobPage.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(CloseJobPage.permittedRoles).not.toContain(role)
    })
  })
})
