export const canManageJobs = (user) => {
  return user.hasContractorPermissions || !user.hasAgentPermissions
}

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

export const canAccessWorkOrder = (user) => {
  return (
    user.hasAgentPermissions ||
    user.hasContractManagerPermissions ||
    user.hasAuthorisationManagerPermissions
  )
}

export const canSeeWorkOrders = (user) => {
  return (
    user.hasContractorPermissions ||
    user.hasAuthorisationManagerPermissions ||
    user.hasContractManagerPermissions
  )
}
