export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'
export const DLO_CONTRACTOR_ROLE = 'dlo_contractor'
export const CONTRACT_MANAGER_ROLE = 'contract_manager'
export const AUTHORISATION_MANAGER_ROLE = 'authorisation_manager'
export const OPERATIVE_ROLE = 'operative'
export const BUDGET_CODE_OFFICER_ROLE = 'budget_code_officer'
export const DATA_ADMIN_ROLE = 'data_admin'
export const FOLLOWON_ADMIN_ROLE = 'followon_admin'

export const ALL_ROLES = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
  BUDGET_CODE_OFFICER_ROLE,
  DATA_ADMIN_ROLE,
  FOLLOWON_ADMIN_ROLE,
  DLO_CONTRACTOR_ROLE,
]

export const buildUser = (
  name: string,
  email: string,
  authServiceGroups: string[]
) => {
  const {
    CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
    AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
    OPERATIVES_GOOGLE_GROUPNAME,
    BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME,
    DATA_ADMIN_GOOGLE_GROUPNAME,
    FOLLOWON_ADMIN_GOOGLE_GROUPNAME,
    DLO_CONTRACTOR_GOOGLE_GROUPNAME,
  } = process.env

  const CONTRACTORS_GOOGLE_GROUPNAME_REGEX =
    process.env.CONTRACTORS_GOOGLE_GROUPNAME_REGEX || ''

  const AGENTS_GOOGLE_GROUPNAME_REGEX =
    process.env.AGENTS_GOOGLE_GROUPNAME_REGEX || ''

  const contractorGroupRegex = new RegExp(CONTRACTORS_GOOGLE_GROUPNAME_REGEX)
  const agentGroupRegex = new RegExp(AGENTS_GOOGLE_GROUPNAME_REGEX)

  const rolesFromGroups = (groupNames: string[]) => {
    const roles: string[] = groupNames.map((groupName) => {
      if (isAgentGroupName(groupName)) {
        return AGENT_ROLE
      }

      if (isContractManagerGroupName(groupName)) {
        return CONTRACT_MANAGER_ROLE
      }

      if (isAuthorisationManagerGroupName(groupName)) {
        return AUTHORISATION_MANAGER_ROLE
      }

      if (isDloContractorGroupName(groupName)) {
        return DLO_CONTRACTOR_ROLE
      }

      if (isContractorGroupName(groupName)) {
        return CONTRACTOR_ROLE
      }

      if (isOperativeGroupName(groupName)) {
        return OPERATIVE_ROLE
      }

      if (isBudgetCodeOfficerGroupName(groupName)) {
        return BUDGET_CODE_OFFICER_ROLE
      }

      if (isDataAdminGroupName(groupName)) {
        return DATA_ADMIN_ROLE
      }

      if (isFollowOnAdminGroupName(groupName)) {
        return FOLLOWON_ADMIN_ROLE
      }

      console.warn(`User group name not recognised: ${groupName}`)
    })

    if (roles.includes(DLO_CONTRACTOR_ROLE)) {
      roles.push(CONTRACTOR_ROLE)
    }

    return roles
  }

  const isAgentGroupName = (groupName: string) =>
    !!agentGroupRegex.test(groupName)

  const isContractorGroupName = (groupName: string) =>
    !!contractorGroupRegex.test(groupName)

  const isContractManagerGroupName = (groupName: string) =>
    groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME

  const isAuthorisationManagerGroupName = (groupName: string) =>
    groupName === AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME

  const isOperativeGroupName = (groupName: string) =>
    groupName === OPERATIVES_GOOGLE_GROUPNAME

  const isBudgetCodeOfficerGroupName = (groupName: string) =>
    groupName === BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME

  const isDataAdminGroupName = (groupName: string) =>
    groupName === DATA_ADMIN_GOOGLE_GROUPNAME

  const isFollowOnAdminGroupName = (groupName: string) =>
    groupName === FOLLOWON_ADMIN_GOOGLE_GROUPNAME

  const isDloContractorGroupName = (groupName: string) =>
    groupName === DLO_CONTRACTOR_GOOGLE_GROUPNAME

  const groupNames = authServiceGroups.filter(
    (groupName) =>
      isContractManagerGroupName(groupName) ||
      isAuthorisationManagerGroupName(groupName) ||
      isAgentGroupName(groupName) ||
      isDloContractorGroupName(groupName) ||
      isContractorGroupName(groupName) ||
      isOperativeGroupName(groupName) ||
      isBudgetCodeOfficerGroupName(groupName) ||
      isDataAdminGroupName(groupName) ||
      isFollowOnAdminGroupName(groupName)
  )

  const roles: string[] = rolesFromGroups(groupNames)

  const hasRole = (r: string) => roles.includes(r)

  const hasExternalContractorPermissions = () => {
    if (hasRole(DLO_CONTRACTOR_ROLE)) {
      // internal contractor
      return false
    }

    return hasRole(CONTRACTOR_ROLE)
  }

  return {
    name: name,
    email: email,
    roles: roles,
    hasRole: hasRole,
    hasAgentPermissions: hasRole(AGENT_ROLE),
    hasContractorPermissions: hasRole(CONTRACTOR_ROLE),
    hasDLOContractorPermissions: hasRole(DLO_CONTRACTOR_ROLE),
    hasExternalContractorPermissions: hasExternalContractorPermissions(),
    hasContractManagerPermissions: hasRole(CONTRACT_MANAGER_ROLE),
    hasAuthorisationManagerPermissions: hasRole(AUTHORISATION_MANAGER_ROLE),
    hasOperativePermissions: hasRole(OPERATIVE_ROLE),
    hasAnyPermissions: roles.length > 0,
    hasBudgetCodeOfficerPermissions: hasRole(BUDGET_CODE_OFFICER_ROLE),
    hasDataAdminPermissions: hasRole(DATA_ADMIN_ROLE),
    hasFollowOnAdminPermissions: hasRole(FOLLOWON_ADMIN_ROLE),
  }
}
