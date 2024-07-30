import { OPERATIVE_ROLE } from './user'

export const canSeeAllFilters = (user) => {
  return (
    !user.hasContractorPermissions ||
    user.hasAgentPermissions ||
    user.hasAuthorisationManagerPermissions ||
    user.hasContractManagerPermissions
  )
}

export const canSeeAppointmentDetailsInfo = (user) => {
  return (
    user.hasAgentPermissions ||
    user.hasContractorPermissions ||
    user.hasContractManagerPermissions
  )
}

export const canScheduleAppointment = (user) => {
  return (
    user.hasAgentPermissions ||
    user.hasContractManagerPermissions ||
    user.hasAuthorisationManagerPermissions
  )
}

export const canSearchForProperty = (user) => {
  return (
    user.hasAgentPermissions ||
    user.hasContractManagerPermissions ||
    user.hasAuthorisationManagerPermissions ||
    user.hasContractorPermissions
  )
}

export const canAccessWorkOrder = (user) => {
  return (
    user.hasAgentPermissions ||
    user.hasContractManagerPermissions ||
    user.hasAuthorisationManagerPermissions ||
    user.hasContractorPermissions
  )
}

export const canSeeWorkOrders = (user) => {
  return (
    user.hasContractorPermissions ||
    user.hasAuthorisationManagerPermissions ||
    user.hasContractManagerPermissions
  )
}

export const canSeeOperativeWorkOrders = (user) => {
  return user.hasOperativePermissions
}

export const canSeeWorkOrder = (user) => {
  return (
    user.hasAgentPermissions ||
    user.hasContractorPermissions ||
    user.hasContractManagerPermissions ||
    user.hasAuthorisationManagerPermissions
  )
}

export const canAttendOwnWorkOrder = (user) => {
  return user
    ? user.roles.length === 1 && user.roles[0] === OPERATIVE_ROLE
    : false
}

export const canAssignBudgetCode = (user) =>
  user.hasBudgetCodeOfficerPermissions
