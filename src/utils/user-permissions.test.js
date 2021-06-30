import {
  canManageJobs,
  canSeeAllFilters,
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
  canAccessWorkOrder,
} from './user-permissions'

describe('canManageJobs', () => {
  describe('when user is allowed to manage jobs', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasContractorPermissions: true,
      hasAgentPermissions: false,
    }
    it('returns true', () => {
      expect(canManageJobs(user)).toBe(true)
    })
  })

  describe('when user are NOT allowed to manage jobs', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasContractorPermissions: false,
      hasAgentPermissions: true,
    }
    it('returns false', () => {
      expect(canManageJobs(user)).toBe(false)
    })
  })
})

describe('canSeeAllFilters', () => {
  describe('when user can see all filters', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasContractorPermissions: false,
      hasAgentPermissions: true,
      hasAuthorisationManagerPermissions: true,
      hasContractManagerPermissions: true,
    }
    it('returns true', () => {
      expect(canSeeAllFilters(user)).toBe(true)
    })
  })

  describe('when user are NOT allowed to see filters', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasContractorPermissions: true,
      hasAgentPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasContractManagerPermissions: false,
    }
    it('returns fale', () => {
      expect(canSeeAllFilters(user)).toBe(false)
    })
  })
})

describe('canSeeAppointmentDetailsInfo', () => {
  describe('when user allowed to see Appointment Details', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: true,
      hasContractorPermissions: true,
      hasContractManagerPermissions: true,
    }
    it('returns true', () => {
      expect(canSeeAppointmentDetailsInfo(user)).toBe(true)
    })
  })

  describe('when user is NOT allowed to see Appointment Details', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
    }
    it('returns false', () => {
      expect(canSeeAppointmentDetailsInfo(user)).toBe(false)
    })
  })
})

describe('canScheduleAppointment', () => {
  describe('when user allowed to schedule an appointment', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: true,
      hasContractManagerPermissions: true,
      hasAuthorisationManagerPermissions: true,
    }
    it('returns true', () => {
      expect(canScheduleAppointment(user)).toBe(true)
    })
  })

  describe('when user NOT allowed to schedule an appointment', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
    }
    it('returns false', () => {
      expect(canScheduleAppointment(user)).toBe(false)
    })
  })
})

describe('canAccessWorkOrder', () => {
  describe('when user allowed to access work order', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: true,
      hasContractManagerPermissions: true,
      hasAuthorisationManagerPermissions: true,
    }
    it('returns true', () => {
      expect(canAccessWorkOrder(user)).toBe(true)
    })
  })

  describe('when user NOT allowed to access work order', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
    }
    it('returns false', () => {
      expect(canAccessWorkOrder(user)).toBe(false)
    })
  })
})
