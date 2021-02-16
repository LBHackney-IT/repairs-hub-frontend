import UpdateJobPage from 'src/pages/repairs/jobs/[id]/update-job'
import { AGENT_ROLE, CONTRACTOR_ROLE } from 'src/utils/user'

describe('UpdateJobPage.permittedRoles', () => {
  ;[CONTRACTOR_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(UpdateJobPage.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(UpdateJobPage.permittedRoles).not.toContain(role)
    })
  })
})
