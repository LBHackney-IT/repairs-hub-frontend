import ChooseJobOptionPage from 'src/pages/repairs/jobs/[id]/close-job'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from 'src/utils/user'

describe('ChooseJobOptionPage.permittedRoles', () => {
  ;[CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(ChooseJobOptionPage.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(ChooseJobOptionPage.permittedRoles).not.toContain(role)
    })
  })
})
