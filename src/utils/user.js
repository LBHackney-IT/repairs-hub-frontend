export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'

export const buildUser = (name, email, authServiceGroups) => {
  const {
    CONTRACTORS_GOOGLE_GROUPNAME_PREFIX,
    AGENTS_GOOGLE_GROUPNAME,
  } = process.env

  const contractorGroupRegex = new RegExp(
    `^${CONTRACTORS_GOOGLE_GROUPNAME_PREFIX}`
  )

  const rolesFromGroups = (groupNames) => {
    return groupNames.map((groupName) => {
      if (groupName === AGENTS_GOOGLE_GROUPNAME) {
        return AGENT_ROLE
      } else if (hasContractorGroupPrefix(groupName)) {
        return CONTRACTOR_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  const hasContractorGroupPrefix = (groupName) =>
    !!contractorGroupRegex.test(groupName)

  const groupNames = authServiceGroups.filter(
    (groupName) =>
      groupName === AGENTS_GOOGLE_GROUPNAME ||
      hasContractorGroupPrefix(groupName)
  )

  const roles = rolesFromGroups(groupNames)

  const hasRole = (r) => roles.includes(r)

  return {
    name: name,
    email: email,
    hasRole: hasRole,
    hasAgentPermissions: hasRole(AGENT_ROLE),
    hasContractorPermissions: hasRole(CONTRACTOR_ROLE),
    hasAnyPermissions: roles.length > 0,
  }
}
