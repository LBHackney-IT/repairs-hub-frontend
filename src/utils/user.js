export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'

export const buildUser = (name, email, authServiceGroups) => {
  const {
    REPAIRS_AGENTS_GOOGLE_GROUPNAME,
    CONTRACTORS_GOOGLE_GROUPNAME,
  } = process.env

  const authServiceGroupRoleMap = {
    [REPAIRS_AGENTS_GOOGLE_GROUPNAME]: AGENT_ROLE,
    [CONTRACTORS_GOOGLE_GROUPNAME]: CONTRACTOR_ROLE,
  }

  const roles = authServiceGroups
    .filter((g) => authServiceGroupRoleMap[g])
    .map((g) => authServiceGroupRoleMap[g])

  const hasRole = (role) => roles.includes(role)

  return {
    name: name,
    email: email,
    hasRole: hasRole,
    hasAgentPermissions: hasRole(AGENT_ROLE),
    hasContractorPermissions: hasRole(CONTRACTOR_ROLE),
    hasAnyPermissions: roles.length > 0,
  }
}
