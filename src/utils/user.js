export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'
export const CONTRACT_MANAGER_ROLE = 'contract_manager'
export const AUTHORISATION_MANAGER_ROLE = 'authorisation_manager'

export const buildUser = (name, email, authServiceGroups) => {
  const {
    CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
    AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
  } = process.env

  const CONTRACTORS_GOOGLE_GROUPNAME_REGEX =
    process.env.CONTRACTORS_GOOGLE_GROUPNAME_REGEX || false

  const AGENTS_GOOGLE_GROUPNAME_REGEX =
    process.env.AGENTS_GOOGLE_GROUPNAME_REGEX || false

  const contractorGroupRegex = new RegExp(CONTRACTORS_GOOGLE_GROUPNAME_REGEX)
  const agentGroupRegex = new RegExp(AGENTS_GOOGLE_GROUPNAME_REGEX)

  const rolesFromGroups = (groupNames) => {
    return groupNames.map((groupName) => {
      if (isAgentGroupName(groupName)) {
        return AGENT_ROLE
      } else if (groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME) {
        return CONTRACT_MANAGER_ROLE
      } else if (groupName === AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME) {
        return AUTHORISATION_MANAGER_ROLE
      } else if (isContractorGroupName(groupName)) {
        return CONTRACTOR_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  const isAgentGroupName = (groupName) => !!agentGroupRegex.test(groupName)

  const isContractorGroupName = (groupName) =>
    !!contractorGroupRegex.test(groupName)

  const groupNames = authServiceGroups.filter(
    (groupName) =>
      groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME ||
      groupName === AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME ||
      isAgentGroupName(groupName) ||
      isContractorGroupName(groupName)
  )

  const roles = rolesFromGroups(groupNames)

  const hasRole = (r) => roles.includes(r)

  return {
    name: name,
    email: email,
    roles: roles,
    hasRole: hasRole,
    hasAgentPermissions: hasRole(AGENT_ROLE),
    hasContractorPermissions: hasRole(CONTRACTOR_ROLE),
    hasContractManagerPermissions: hasRole(CONTRACT_MANAGER_ROLE),
    hasAuthorisationManagerPermissions: hasRole(AUTHORISATION_MANAGER_ROLE),
    hasAnyPermissions: roles.length > 0,
  }
}
