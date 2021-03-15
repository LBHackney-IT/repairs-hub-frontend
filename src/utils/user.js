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

  const roleFromGroup = (groupName) => {
    if (groupName === AGENTS_GOOGLE_GROUPNAME) {
      return AGENT_ROLE
    } else if (hasContractorGroupPrefix(groupName)) {
      return CONTRACTOR_ROLE
    }

    console.log(`User group name not recognised: ${groupName}`)
  }

  const hasContractorGroupPrefix = (groupName) =>
    !!contractorGroupRegex.test(groupName)

  const groupName = authServiceGroups.find(
    (groupName) =>
      groupName === AGENTS_GOOGLE_GROUPNAME ||
      hasContractorGroupPrefix(groupName)
  )

  const role = roleFromGroup(groupName)

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
