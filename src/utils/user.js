export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'
export const CONTRACT_MANAGER_ROLE = 'contract_manager'
export const AUTHORISATION_MANAGER_ROLE = 'authorisation_manager'
export const OPERATIVE_ROLE = 'operative'
export const BUDGET_CODE_OFFICER_ROLE = 'budget_code_officer'
export const DATA_ADMIN_ROLE = 'data_admin'

export const buildUser = (name, email, authServiceGroups) => {
  const {
    CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
    AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
    OPERATIVES_GOOGLE_GROUPNAME,
    BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME,
    DATA_ADMIN_GOOGLE_GROUPNAME,
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
      } else if (isContractManagerGroupName(groupName)) {
        return CONTRACT_MANAGER_ROLE
      } else if (isAuthorisationManagerGroupName(groupName)) {
        return AUTHORISATION_MANAGER_ROLE
      } else if (isContractorGroupName(groupName)) {
        return CONTRACTOR_ROLE
      } else if (isOperativeGroupName(groupName)) {
        return OPERATIVE_ROLE
      } else if (isBudgetCodeOfficerGroupName(groupName)) {
        return BUDGET_CODE_OFFICER_ROLE
      } else if (isDataAdminGroupName(groupName)) {
        return DATA_ADMIN_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  const isAgentGroupName = (groupName) => !!agentGroupRegex.test(groupName)

  const isContractorGroupName = (groupName) =>
    !!contractorGroupRegex.test(groupName)

  const isContractManagerGroupName = (groupName) =>
    groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME

  const isAuthorisationManagerGroupName = (groupName) =>
    groupName === AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME

  const isOperativeGroupName = (groupName) =>
    groupName === OPERATIVES_GOOGLE_GROUPNAME

  const isBudgetCodeOfficerGroupName = (groupName) =>
    groupName === BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME

  const isDataAdminGroupName = (groupName) =>
    groupName === DATA_ADMIN_GOOGLE_GROUPNAME

  const groupNames = authServiceGroups.filter(
    (groupName) =>
      isContractManagerGroupName(groupName) ||
      isAuthorisationManagerGroupName(groupName) ||
      isAgentGroupName(groupName) ||
      isContractorGroupName(groupName) ||
      isOperativeGroupName(groupName) ||
      isBudgetCodeOfficerGroupName(groupName) ||
      isDataAdminGroupName(groupName)
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
    hasOperativePermissions: hasRole(OPERATIVE_ROLE),
    hasAnyPermissions: roles.length > 0,
    hasBudgetCodeOfficerPermissions: hasRole(BUDGET_CODE_OFFICER_ROLE),
    hasDataAdminPermissions: hasRole(DATA_ADMIN_ROLE),
  }
}
