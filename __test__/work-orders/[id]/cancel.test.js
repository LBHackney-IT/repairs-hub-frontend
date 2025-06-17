import WorkOrderCancelPage from 'src/pages/work-orders/[id]/cancel'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/root/src/utils/user'

describe('WorkOrderCancelPage.permittedRoles', () => {
  ;[AGENT_ROLE, AUTHORISATION_MANAGER_ROLE, CONTRACT_MANAGER_ROLE].forEach(
    (role) => {
      it(`permits the ${role} role to access the page`, () => {
        expect(WorkOrderCancelPage.permittedRoles).toContain(role)
      })
    }
  )
  ;[CONTRACTOR_ROLE, OPERATIVE_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(WorkOrderCancelPage.permittedRoles).not.toContain(role)
    })
  })
})
