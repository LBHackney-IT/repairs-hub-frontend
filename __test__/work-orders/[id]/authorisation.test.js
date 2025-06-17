import AuthorisationPage from 'src/pages/work-orders/[id]/authorisation'
import VariationAuthorisationPage from 'src/pages/work-orders/[id]/variation-authorisation'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/root/src/utils/auth/user'

describe('AuthorisationPage.permittedRoles', () => {
  ;[AUTHORISATION_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(AuthorisationPage.permittedRoles).toContain(role)
    })
  })
  ;[AGENT_ROLE, CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE, OPERATIVE_ROLE].forEach(
    (role) => {
      it(`does not permit the ${role} role to access the page`, () => {
        expect(AuthorisationPage.permittedRoles).not.toContain(role)
      })
    }
  )
})

describe('VariationAuthorisationPage.permittedRoles', () => {
  ;[CONTRACT_MANAGER_ROLE].forEach((role) => {
    it(`permits the ${role} role to access the page`, () => {
      expect(VariationAuthorisationPage.permittedRoles).toContain(role)
    })
  })
  ;[
    AGENT_ROLE,
    AUTHORISATION_MANAGER_ROLE,
    CONTRACTOR_ROLE,
    OPERATIVE_ROLE,
  ].forEach((role) => {
    it(`does not permit the ${role} role to access the page`, () => {
      expect(VariationAuthorisationPage.permittedRoles).not.toContain(role)
    })
  })
})
