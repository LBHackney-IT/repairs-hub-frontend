import WorkOrderUpdatePage from 'src/pages/work-orders/[id]/update'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/root/src/utils/user'

describe('WorkOrderUpdatePage.permittedRoles', () => {
  ;[CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(WorkOrderUpdatePage.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE, AUTHORISATION_MANAGER_ROLE, OPERATIVE_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(WorkOrderUpdatePage.permittedRoles).not.toContain(role)
    })
  })
})
