export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'
export const CONTRACT_MANAGER_ROLE = 'contract_manager'

export const buildUser = (name, email, authServiceGroups) => {
  const {
    CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
    AGENTS_GOOGLE_GROUPNAME,
  } = process.env

  const CONTRACTORS_GOOGLE_GROUPNAME_REGEX =
    process.env.CONTRACTORS_GOOGLE_GROUPNAME_REGEX || false

  const contractorGroupRegex = new RegExp(CONTRACTORS_GOOGLE_GROUPNAME_REGEX)

  const rolesFromGroups = (groupNames) => {
    return groupNames.map((groupName) => {
      if (groupName === AGENTS_GOOGLE_GROUPNAME) {
        return AGENT_ROLE
      } else if (groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME) {
        return CONTRACT_MANAGER_ROLE
      } else if (isContractorGroupName(groupName)) {
        return CONTRACTOR_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  const isContractorGroupName = (groupName) =>
    !!contractorGroupRegex.test(groupName)

  const groupNames = authServiceGroups.filter(
    (groupName) =>
      groupName === AGENTS_GOOGLE_GROUPNAME ||
      groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME ||
      isContractorGroupName(groupName)
  )

  const roles = rolesFromGroups(groupNames)

  const hasRole = (r) => roles.includes(r)

  return {
    name: name,
    email: email,
    hasRole: hasRole,
    hasAgentPermissions: hasRole(AGENT_ROLE),
    hasContractorPermissions: hasRole(CONTRACTOR_ROLE),
    hasContractManagerPermissions: hasRole(CONTRACT_MANAGER_ROLE),
    hasAnyPermissions: roles.length > 0,
  }
}
