import {
  buildUser,
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from './user'

const {
  AGENTS_GOOGLE_GROUPNAME,
  CONTRACTORS_GOOGLE_GROUPNAME_PREFIX,
  CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
} = process.env

describe('buildUser', () => {
  describe('when called with a single agent group name', () => {
    const user = buildUser('', '', [AGENTS_GOOGLE_GROUPNAME])

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

    describe('hasContractManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasContractManagerPermissions).toBe(false)
      })
    })
  })

  describe('when called with a single contractor group name', () => {
    const user = buildUser('', '', [
      `${CONTRACTORS_GOOGLE_GROUPNAME_PREFIX}-alphatrack`,
    ])

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

    describe('hasContractManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasContractManagerPermissions).toBe(false)
      })
    })
  })

  describe('when called with a single contract manager group name', () => {
    const user = buildUser('', '', [CONTRACT_MANAGERS_GOOGLE_GROUPNAME])
    describe('hasContractorPermissions', () => {
      it('returns false', () => {
        expect(user.hasContractorPermissions).toBe(false)
      })
    })

    describe('hasAgentPermissions', () => {
      it('returns false', () => {
        expect(user.hasAgentPermissions).toBe(false)
      })
    })

    describe('hasContractManagerPermissions', () => {
      it('returns true', () => {
        expect(user.hasContractManagerPermissions).toBe(true)
      })
    })
  })

  describe('hasRole', () => {
    const user = buildUser('', '', [AGENTS_GOOGLE_GROUPNAME])

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

    describe('when the supplied role does not map to the group name for the user', () => {
      it('returns false', () => {
        expect(user.hasRole(CONTRACT_MANAGER_ROLE)).toBe(false)
      })
    })
  })

  describe('hasAnyPermissions', () => {
    describe('when the group name for the user maps to a recognised role', () => {
      const user = buildUser('', '', [AGENTS_GOOGLE_GROUPNAME])

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
})
