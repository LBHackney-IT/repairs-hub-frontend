import { signSessionCookie } from '../../factories/session_cookie'
import {
  buildUser,
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  DLO_CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
  BUDGET_CODE_OFFICER_ROLE,
  DATA_ADMIN_ROLE,
  CONTRACT_ADMIN_ROLE,
  FOLLOWON_ADMIN_ROLE,
} from '../../src/utils/user'

export type E2eRole =
  | 'agent'
  | 'contractor'
  | 'agentAndContractor'
  | 'multipleContractor'
  | 'contractManager'
  | 'authorisationManager'
  | 'operative'
  | 'agentAndBudgetCodeOfficer'
  | 'dataAdmin'
  | 'contractAdmin'
  | 'followOnAdmin'

// Env variables holding the Cognito group name(s) each role signs in with. Most
// are the same variables the app matches exactly. Agents and contractors are
// matched by regex in the app, so they need a group name of their own.
const ROLE_GROUP_VARIABLES: Record<E2eRole, string[]> = {
  agent: ['E2E_AGENT_GROUP'],
  contractor: ['E2E_CONTRACTOR_GROUP'],
  agentAndContractor: ['E2E_AGENT_GROUP', 'DLO_CONTRACTOR_GOOGLE_GROUPNAME'],
  multipleContractor: ['E2E_CONTRACTOR_GROUP', 'E2E_SECOND_CONTRACTOR_GROUP'],
  contractManager: ['CONTRACT_MANAGERS_GOOGLE_GROUPNAME'],
  authorisationManager: ['AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME'],
  operative: ['OPERATIVES_GOOGLE_GROUPNAME'],
  agentAndBudgetCodeOfficer: [
    'E2E_AGENT_GROUP',
    'BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME',
  ],
  dataAdmin: ['DATA_ADMIN_GOOGLE_GROUPNAME'],
  contractAdmin: ['CONTRACT_ADMIN_GOOGLE_GROUPNAME'],
  // Raising a repair is an agent page, so a follow-on admin is an agent too
  followOnAdmin: ['E2E_AGENT_GROUP', 'FOLLOWON_ADMIN_GOOGLE_GROUPNAME'],
}

// The role each group variable has to give the user
const VARIABLE_ROLE: Record<string, string> = {
  E2E_AGENT_GROUP: AGENT_ROLE,
  E2E_CONTRACTOR_GROUP: CONTRACTOR_ROLE,
  E2E_SECOND_CONTRACTOR_GROUP: CONTRACTOR_ROLE,
  DLO_CONTRACTOR_GOOGLE_GROUPNAME: DLO_CONTRACTOR_ROLE,
  CONTRACT_MANAGERS_GOOGLE_GROUPNAME: CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME: AUTHORISATION_MANAGER_ROLE,
  OPERATIVES_GOOGLE_GROUPNAME: OPERATIVE_ROLE,
  BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME: BUDGET_CODE_OFFICER_ROLE,
  DATA_ADMIN_GOOGLE_GROUPNAME: DATA_ADMIN_ROLE,
  CONTRACT_ADMIN_GOOGLE_GROUPNAME: CONTRACT_ADMIN_ROLE,
  FOLLOWON_ADMIN_GOOGLE_GROUPNAME: FOLLOWON_ADMIN_ROLE,
}

const groupsForRole = (role: E2eRole) =>
  ROLE_GROUP_VARIABLES[role].map((variable) => {
    const group = process.env[variable]

    if (!group) {
      throw new Error(`${variable} must be set to sign in as "${role}"`)
    }

    // Catch a group the app won't map to the expected role here, instead of the
    // spec ending up on Access denied (or signed in as the wrong role)
    const expectedRole = VARIABLE_ROLE[variable]
    const roles = buildUser('', '', [group]).roles

    if (!roles.includes(expectedRole)) {
      throw new Error(
        `${variable}="${group}" should give the "${expectedRole}" role but gives ${
          roles.length ? `[${roles.join(', ')}]` : 'no role'
        }, so signing in as "${role}" would fail. Check it against the group settings in the env file the app and Cypress read.`
      )
    }

    return group
  })

// A real next-auth session cookie, encrypted with the app's NEXTAUTH_SECRET so
// the app accepts it like one from a Cognito sign-in. Its id token is unsigned,
// so calls that reach the real backend fail: specs must intercept their API calls.
export const signSessionCookieForRole = async (role: E2eRole) => {
  // Specs expect the user's name in the notes they create ("A Name opened the
  // DRS Web Booking Manager")
  const { name, value } = await signSessionCookie({
    name: 'A Name',
    groups: groupsForRole(role),
  })

  return { name, value }
}
