import {
  buildUser,
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from './user'

const {
  CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
  AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
  OPERATIVES_GOOGLE_GROUPNAME,
  BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME,
  DLO_CONTRACTOR_GOOGLE_GROUPNAME,
} = process.env

const CONTRACTOR_GROUP_NAME = 'repairs-hub-contractors-staging-alphatrack'
const AGENT_GROUP_NAME = 'repairs-hub-agents-staging'

describe('buildUser', () => {
  describe('when called with a single agent group name', () => {
    const user = buildUser('', '', [AGENT_GROUP_NAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(false)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(false)
      })
    })

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

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(false)
      })
    })

    describe('hasOperativePermissions', () => {
      it('returns false', () => {
        expect(user.hasOperativePermissions).toBe(false)
      })
    })
  })

  describe('when called with a single contractor group name', () => {
    const user = buildUser('', '', [CONTRACTOR_GROUP_NAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(false)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(true)
      })
    })

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

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(false)
      })
    })

    describe('hasOperativePermissions', () => {
      it('returns false', () => {
        expect(user.hasOperativePermissions).toBe(false)
      })
    })
  })

  describe('when called with a single dlo contractor group name', () => {
    const user = buildUser('', '', [DLO_CONTRACTOR_GOOGLE_GROUPNAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(true)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(false)
      })
    })

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

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(false)
      })
    })

    describe('hasOperativePermissions', () => {
      it('returns false', () => {
        expect(user.hasOperativePermissions).toBe(false)
      })
    })
  })

  describe('when called with a single contract manager group name', () => {
    const user = buildUser('', '', [CONTRACT_MANAGERS_GOOGLE_GROUPNAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(false)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(false)
      })
    })

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

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(false)
      })
    })

    describe('hasOperativePermissions', () => {
      it('returns false', () => {
        expect(user.hasOperativePermissions).toBe(false)
      })
    })
  })

  describe('when called with a single authorisation manager group name', () => {
    const user = buildUser('', '', [AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(false)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(false)
      })
    })

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
      it('returns false', () => {
        expect(user.hasContractManagerPermissions).toBe(false)
      })
    })

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns true', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(true)
      })
    })

    describe('hasOperativePermissions', () => {
      it('returns false', () => {
        expect(user.hasOperativePermissions).toBe(false)
      })
    })
  })

  describe('hasRole', () => {
    const user = buildUser('', '', [AGENT_GROUP_NAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(false)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(false)
      })
    })

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

    describe('when the supplied role does not map to the group name for the user', () => {
      it('returns false', () => {
        expect(user.hasRole(AUTHORISATION_MANAGER_ROLE)).toBe(false)
      })
    })

    describe('when the supplied role does not map to the group name for the user', () => {
      it('returns false', () => {
        expect(user.hasRole(OPERATIVE_ROLE)).toBe(false)
      })
    })
  })

  describe('hasAnyPermissions', () => {
    describe('when the group name for the user maps to a recognised role', () => {
      const user = buildUser('', '', [AGENT_GROUP_NAME])

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

  describe('when called with a single operative group name', () => {
    const user = buildUser('', '', [OPERATIVES_GOOGLE_GROUPNAME])

    describe('hasDLOContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasDLOContractorPermissions).toBe(false)
      })
    })

    describe('hasExternalContractorPermissions', () => {
      it('returns true', () => {
        expect(user.hasExternalContractorPermissions).toBe(false)
      })
    })

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
      it('returns false', () => {
        expect(user.hasContractManagerPermissions).toBe(false)
      })
    })

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns true', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(false)
      })
    })

    describe('hasOperativePermissions', () => {
      it('returns true', () => {
        expect(user.hasOperativePermissions).toBe(true)
      })
    })

    describe('hasBudgetCodeOfficerPermissions', () => {
      it('returns false', () => {
        expect(user.hasBudgetCodeOfficerPermissions).toBe(false)
      })
    })
  })

  describe('when called with a single budget code officer group name', () => {
    const user = buildUser('', '', [BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME])

    describe('hasBudgetCodeOfficerPermissions', () => {
      it('returns true', () => {
        expect(user.hasBudgetCodeOfficerPermissions).toBe(true)
      })
    })

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
      it('returns false', () => {
        expect(user.hasContractManagerPermissions).toBe(false)
      })
    })

    describe('hasAuthorisationManagerPermissions', () => {
      it('returns false', () => {
        expect(user.hasAuthorisationManagerPermissions).toBe(false)
      })
    })

    //check how to compact it into an array: all perissions that need to be false (user.apply...)
    describe('hasOperativePermissions', () => {
      it('returns false', () => {
        expect(user.hasOperativePermissions).toBe(false)
      })
    })
  })
})
