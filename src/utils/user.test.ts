import {
  buildUser,
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from './user'

type User = ReturnType<typeof buildUser>
type Permissions = Partial<Record<keyof User, boolean>>

const GROUPS = {
  agent: 'test-agents',
  contractor: 'test-contractors-acme',
  dloContractor: 'test-contractors-dlo',
  contractManager: 'test-contract-managers',
  contractorCanCancel: 'test-contractor-can-cancel',
  authorisationManager: 'test-authorisation-managers',
  operative: 'test-operatives',
  budgetCodeOfficer: 'test-budget-code-officers',
  dataAdmin: 'test-data-admins',
  contractAdmin: 'test-contract-admins',
  followOnAdmin: 'test-followon-admins',
}

// Every permission flag, all off. Each group below switches on only its own.
const NO_PERMISSIONS: Permissions = {
  hasAgentPermissions: false,
  hasContractorPermissions: false,
  hasDLOContractorPermissions: false,
  hasExternalContractorPermissions: false,
  hasContractManagerPermissions: false,
  hasContractorCancelPermissions: false,
  hasAuthorisationManagerPermissions: false,
  hasOperativePermissions: false,
  hasBudgetCodeOfficerPermissions: false,
  hasDataAdminPermissions: false,
  hasContractAdminPermissions: false,
  hasFollowOnAdminPermissions: false,
  hasAnyPermissions: false,
}

describe('buildUser', () => {
  const originalEnv = { ...process.env }

  // buildUser reads these when it is called. Set them here so the tests don't
  // depend on a developer's .env file.
  beforeAll(() => {
    process.env.AGENTS_GOOGLE_GROUPNAME_REGEX = `^${GROUPS.agent}$`
    process.env.CONTRACTORS_GOOGLE_GROUPNAME_REGEX = '^test-contractors-'
    process.env.DLO_CONTRACTOR_GOOGLE_GROUPNAME = GROUPS.dloContractor
    process.env.CONTRACT_MANAGERS_GOOGLE_GROUPNAME = GROUPS.contractManager
    process.env.CONTRACTOR_CAN_CANCEL_GOOGLE_GROUPNAME =
      GROUPS.contractorCanCancel
    process.env.AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME =
      GROUPS.authorisationManager
    process.env.OPERATIVES_GOOGLE_GROUPNAME = GROUPS.operative
    process.env.BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME = GROUPS.budgetCodeOfficer
    process.env.DATA_ADMIN_GOOGLE_GROUPNAME = GROUPS.dataAdmin
    process.env.CONTRACT_ADMIN_GOOGLE_GROUPNAME = GROUPS.contractAdmin
    process.env.FOLLOWON_ADMIN_GOOGLE_GROUPNAME = GROUPS.followOnAdmin
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('when called with a single group name', () => {
    it.each<[string, string, Permissions]>([
      [
        'agent',
        GROUPS.agent,
        { hasAgentPermissions: true, hasAnyPermissions: true },
      ],
      [
        'contractor',
        GROUPS.contractor,
        {
          hasContractorPermissions: true,
          hasExternalContractorPermissions: true,
          hasAnyPermissions: true,
        },
      ],
      [
        'DLO contractor',
        GROUPS.dloContractor,
        // A DLO contractor is also a contractor, but not an external one
        {
          hasContractorPermissions: true,
          hasDLOContractorPermissions: true,
          hasAnyPermissions: true,
        },
      ],
      [
        'contract manager',
        GROUPS.contractManager,
        { hasContractManagerPermissions: true, hasAnyPermissions: true },
      ],
      [
        'contractor can cancel',
        GROUPS.contractorCanCancel,
        { hasContractorCancelPermissions: true, hasAnyPermissions: true },
      ],
      [
        'authorisation manager',
        GROUPS.authorisationManager,
        { hasAuthorisationManagerPermissions: true, hasAnyPermissions: true },
      ],
      [
        'operative',
        GROUPS.operative,
        { hasOperativePermissions: true, hasAnyPermissions: true },
      ],
      [
        'budget code officer',
        GROUPS.budgetCodeOfficer,
        { hasBudgetCodeOfficerPermissions: true, hasAnyPermissions: true },
      ],
      [
        'data admin',
        GROUPS.dataAdmin,
        { hasDataAdminPermissions: true, hasAnyPermissions: true },
      ],
      [
        'contract admin',
        GROUPS.contractAdmin,
        { hasContractAdminPermissions: true, hasAnyPermissions: true },
      ],
      [
        'follow-on admin',
        GROUPS.followOnAdmin,
        { hasFollowOnAdminPermissions: true, hasAnyPermissions: true },
      ],
    ])(
      'the %s group gives only the matching permissions',
      (_, group, expected) => {
        const user = buildUser('', '', [group])

        expect(user).toMatchObject({ ...NO_PERMISSIONS, ...expected })
      }
    )
  })

  describe('when called with several groups', () => {
    it('gives the permissions of all the recognised groups', () => {
      const user = buildUser('', '', [GROUPS.agent, GROUPS.operative])

      expect(user.roles.sort()).toEqual([AGENT_ROLE, OPERATIVE_ROLE].sort())
    })

    it('ignores groups that are not recognised', () => {
      const user = buildUser('', '', ['a made up group', GROUPS.operative])

      expect(user.roles).toEqual([OPERATIVE_ROLE])
    })
  })

  describe('hasRole', () => {
    const user = () => buildUser('', '', [GROUPS.agent])

    it('returns true when the role maps to a group the user is in', () => {
      expect(user().hasRole(AGENT_ROLE)).toBe(true)
    })

    it.each([
      CONTRACTOR_ROLE,
      CONTRACT_MANAGER_ROLE,
      AUTHORISATION_MANAGER_ROLE,
      OPERATIVE_ROLE,
    ])('returns false for %s, which the user is not in a group for', (role) => {
      expect(user().hasRole(role)).toBe(false)
    })
  })

  describe('hasAnyPermissions', () => {
    it('is true when a group maps to a recognised role', () => {
      expect(buildUser('', '', [GROUPS.agent]).hasAnyPermissions).toBe(true)
    })

    it('is false when no group maps to a recognised role', () => {
      expect(buildUser('', '', ['a made up group']).hasAnyPermissions).toBe(
        false
      )
    })

    it('is false when no groups are supplied', () => {
      expect(buildUser('', '', []).hasAnyPermissions).toBe(false)
    })
  })

  it('passes the name and email through', () => {
    const user = buildUser('Ada Lovelace', 'ada@example.com', [])

    expect(user).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    })
  })
})
