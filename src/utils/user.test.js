import { buildUser, AGENT_ROLE, CONTRACTOR_ROLE } from './user'

const {
  REPAIRS_AGENTS_GOOGLE_GROUPNAME,
  CONTRACTORS_ALPHATRACK_GOOGLE_GROUPNAME,
} = process.env

describe('buildUser', () => {
  describe('when called with a single agent group name', () => {
    const user = buildUser('', '', [REPAIRS_AGENTS_GOOGLE_GROUPNAME])

    describe('hasContractorPermissions', () => {
      it('returns false', () => {
        expect(user.hasContractorPermissions).toBe(false)
      })
    })

    describe('hasAgentPermissions', () => {
      it('returns true', () => {
        expect(user.hasAgentPermissions).toBe(true)
      })
    })
  })

  describe('when called with a single contractor group name', () => {
    const user = buildUser('', '', [CONTRACTORS_ALPHATRACK_GOOGLE_GROUPNAME])

    describe('hasContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasContractorPermissions).toBe(true)
      })
    })

    describe('hasAgentPermissions', () => {
      it('returns false', () => {
        expect(user.hasAgentPermissions).toBe(false)
      })
    })
  })

  describe('hasRole', () => {
    const user = buildUser('', '', [REPAIRS_AGENTS_GOOGLE_GROUPNAME])

    describe('when the supplied role maps to the group name for the user', () => {
      it('returns true', () => {
        expect(user.hasRole(AGENT_ROLE)).toBe(true)
      })
    })

    describe('when the supplied role does not map to the group name for the user', () => {
      it('returns false', () => {
        expect(user.hasRole(CONTRACTOR_ROLE)).toBe(false)
      })
    })
  })

  describe('hasAnyPermissions', () => {
    describe('when the group name for the user maps to a recognised role', () => {
      const user = buildUser('', '', [REPAIRS_AGENTS_GOOGLE_GROUPNAME])

      it('returns true', () => {
        expect(user.hasAnyPermissions).toBe(true)
      })
    })

    describe('when the group name for the user does not map to a recognised role', () => {
      const user = buildUser('', '', ['a made up group'])

      it('returns false', () => {
        expect(user.hasAnyPermissions).toBe(false)
      })
    })

    describe('when no group names are supplied', () => {
      const user = buildUser('', '', [])

      it('returns false', () => {
        expect(user.hasAnyPermissions).toBe(false)
      })
    })
  })

  describe('contractorReference', () => {
    describe('when the user is supplied with a single agent group name', () => {
      const user = buildUser('', '', [REPAIRS_AGENTS_GOOGLE_GROUPNAME])

      it('is undefined', () => {
        expect(user.contractorRef).toBeUndefined()
      })
    })

    describe(`when the user is supplied with the group name`, () => {
      const user = buildUser('', '', [
        'repairs-hub-frontend-staging-contractors-alphatrack',
      ])

      it(`ref returns the mapped contractor ref for the supplied group`, () => {
        expect(user.contractorReference).toEqual('SCC')
      })
    })
  })
})
