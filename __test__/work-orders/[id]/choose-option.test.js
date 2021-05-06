import WorkOrderChooseOption from 'src/pages/work-orders/[id]/close'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'

describe('WorkOrderChooseOption.permittedRoles', () => {
  ;[CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(WorkOrderChooseOption.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE, AUTHORISATION_MANAGER_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(WorkOrderChooseOption.permittedRoles).not.toContain(role)
    })
  })
})
