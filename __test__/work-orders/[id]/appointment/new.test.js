import AppointmentPage from 'src/pages/work-orders/[id]/appointment/new'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from 'src/utils/user'

describe('AppointmentPage.permittedRoles', () => {
  ;[AGENT_ROLE, CONTRACT_MANAGER_ROLE, AUTHORISATION_MANAGER_ROLE].forEach(
    (role) => {
      it(`permits the ${role} role to access the page`, () => {
        expect(AppointmentPage.permittedRoles).toContain(role)
      })
    }
  )
  ;[CONTRACTOR_ROLE, OPERATIVE_ROLE].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(AppointmentPage.permittedRoles).not.toContain(role)
    })
  })
})
