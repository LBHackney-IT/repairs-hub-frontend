import EditWorkOrderOperativePage from 'src/pages/work-orders/[id]/operatives/new'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/root/src/utils/user'

describe('EditWorkOrderOperativePage.permittedRoles', () => {
  ;[OPERATIVE_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(EditWorkOrderOperativePage.permittedRoles).toContain(role)
    })
  })
  ;[
    AGENT_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    CONTRACTOR_ROLE,
    CONTRACT_MANAGER_ROLE,
  ].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(EditWorkOrderOperativePage.permittedRoles).not.toContain(role)
    })
  })
})
