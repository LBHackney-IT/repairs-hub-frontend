import { uniqueArrayValues } from '../utils/helpers/array'

export const AGENT_ROLE = 'agent'
export const CONTRACTOR_ROLE = 'contractor'
export const CONTRACT_MANAGER_ROLE = 'contract_manager'
export const AUTHORISATION_MANAGER_ROLE = 'authorisation_manager'

const {
  CONTRACT_MANAGERS_GOOGLE_GROUPNAME,
  AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
} = process.env

const AGENTS_GOOGLE_GROUPNAME_REGEX =
  process.env.AGENTS_GOOGLE_GROUPNAME_REGEX || false

const CONTRACTORS_GOOGLE_GROUPNAME_REGEX =
  process.env.CONTRACTORS_GOOGLE_GROUPNAME_REGEX || false

export class User {
  #authServiceGroups
  constructor(name, email, authServiceGroups) {
    this.name = name
    this.email = email
    this.#authServiceGroups = authServiceGroups
    this.roles = this.#uniqueRolesFromGroups()
  }

  // Public methods
  hasRole(r) {
    return this.roles.includes(r)
  }

  hasAnyPermissions() {
    return this.roles.length > 0
  }

  hasAgentPermissions() {
    return this.hasRole(AGENT_ROLE)
  }

  hasContractorPermissions() {
    return this.hasRole(CONTRACTOR_ROLE)
  }

  hasContractManagerPermissions() {
    return this.hasRole(CONTRACT_MANAGER_ROLE)
  }

  hasAuthorisationManagerPermissions() {
    return this.hasRole(AUTHORISATION_MANAGER_ROLE)
  }

  // Private methods
  #isAgentGroupName(groupName) {
    let agentGroupRegex = new RegExp(AGENTS_GOOGLE_GROUPNAME_REGEX)

    return !!agentGroupRegex.test(groupName)
  }

  #isContractorGroupName(groupName) {
    let contractorGroupRegex = new RegExp(CONTRACTORS_GOOGLE_GROUPNAME_REGEX)

    return !!contractorGroupRegex.test(groupName)
  }

  #isContractManagerGroupName(groupName) {
    return groupName === CONTRACT_MANAGERS_GOOGLE_GROUPNAME
  }

  #isAuthorisationManagerGroupName(groupName) {
    return groupName === AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME
  }

  #groupNames() {
    return this.#authServiceGroups.filter(
      (groupName) =>
        this.#isAgentGroupName(groupName) ||
        this.#isContractorGroupName(groupName) ||
        this.#isContractManagerGroupName(groupName) ||
        this.#isAuthorisationManagerGroupName(groupName)
    )
  }

  #rolesFromGroups() {
    return this.#groupNames().map((groupName) => {
      if (this.#isAgentGroupName(groupName)) {
        return AGENT_ROLE
      } else if (this.#isContractManagerGroupName(groupName)) {
        return CONTRACT_MANAGER_ROLE
      } else if (this.#isAuthorisationManagerGroupName(groupName)) {
        return AUTHORISATION_MANAGER_ROLE
      } else if (this.#isContractorGroupName(groupName)) {
        return CONTRACTOR_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  #uniqueRolesFromGroups() {
    return uniqueArrayValues(this.#rolesFromGroups())
  }
}
