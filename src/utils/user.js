export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'

const {
  CONTRACTORS_ALPHATRACK_GOOGLE_GROUPNAME,
  CONTRACTORS_PURDY_GOOGLE_GROUPNAME,
} = process.env

export const buildUser = (name, email, authServiceGroups) => {
  const { REPAIRS_AGENTS_GOOGLE_GROUPNAME } = process.env

  const groupNameRoleMap = {
    [REPAIRS_AGENTS_GOOGLE_GROUPNAME]: AGENT_ROLE,
    [CONTRACTORS_ALPHATRACK_GOOGLE_GROUPNAME]: CONTRACTOR_ROLE,
    [CONTRACTORS_PURDY_GOOGLE_GROUPNAME]: CONTRACTOR_ROLE,
  }

  const groupName = authServiceGroups.find((groupName) =>
    Object.keys(groupNameRoleMap).includes(groupName)
  )

  const role = groupNameRoleMap[groupName]

  const hasRole = (r) => r === role

  return {
    name: name,
    email: email,
    hasRole: hasRole,
    hasAgentPermissions: role === AGENT_ROLE,
    hasContractorPermissions: role === CONTRACTOR_ROLE,
    hasAnyPermissions: !!role,
  }
}
