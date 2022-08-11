import { OPERATIVE_ROLE } from './user'
import {
  canSeeAllFilters,
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
  canAccessWorkOrder,
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
  canAttendOwnWorkOrder,
  canAssignBudgetCode,
} from './userPermissions'

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
      hasContractorPermissions: true,
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
      hasContractorPermissions: false,
    }
    it('returns false', () => {
      expect(canAccessWorkOrder(user)).toBe(false)
    })
  })
})

describe('canSearchForProperty', () => {
  describe('when user allowed to search for a property', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: true,
      hasContractManagerPermissions: true,
      hasAuthorisationManagerPermissions: true,
      hasContractorPermissions: true,
    }
    it('returns true', () => {
      expect(canSearchForProperty(user)).toBe(true)
    })
  })

  describe('when user NOT allowed to search for a property', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasAgentPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasContractorPermissions: false,
    }
    it('returns false', () => {
      expect(canSearchForProperty(user)).toBe(false)
    })
  })
})

describe('canSeeWorkOrders', () => {
  describe('when user allowed to access work orders', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasContractorPermissions: true,
      hasAuthorisationManagerPermissions: true,
      hasContractManagerPermissions: true,
    }
    it('returns true', () => {
      expect(canSeeWorkOrders(user)).toBe(true)
    })
  })

  describe('when user NOT allowed to access work orders', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasContractorPermissions: false,
      hasAuthorisationManagerPermissions: false,
      hasContractManagerPermissions: false,
    }
    it('returns false', () => {
      expect(canSeeWorkOrders(user)).toBe(false)
    })
  })
})

describe('canSeeOperativeWorkOrders', () => {
  describe('when user allowed to access operative work orders', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasOperativePermissions: true,
    }
    it('returns true', () => {
      expect(canSeeOperativeWorkOrders(user)).toBe(true)
    })
  })

  describe('when user NOT allowed to access operative work orders', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasOperativePermissions: false,
    }
    it('returns false', () => {
      expect(canSeeOperativeWorkOrders(user)).toBe(false)
    })
  })
})

describe('canAttendOwnWorkOrder', () => {
  let user

  describe('when the user has only an operative role', () => {
    beforeEach(() => {
      user = { roles: [OPERATIVE_ROLE] }
    })

    it('returns true', () => {
      expect(canAttendOwnWorkOrder(user)).toBe(true)
    })
  })

  describe('when the user does not just have the operative role', () => {
    beforeEach(() => {
      user = { roles: [OPERATIVE_ROLE, 'another_role'] }
    })

    it('returns false', () => {
      expect(canAttendOwnWorkOrder(user)).toBe(false)
    })
  })
})

describe('canAssignBudgetCode', () => {
  describe('when the user has budget code officer permissions', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasBudgetCodeOfficerPermissions: true,
    }

    it('returns true', () => {
      expect(canAssignBudgetCode(user)).toBe(true)
    })
  })

  describe('when the user does not have budget code officer permissions', () => {
    const user = {
      name: 'Test Testerston',
      email: 'test@test.com',
      hasBudgetCodeOfficerPermissions: false,
    }

    it('returns false', () => {
      expect(canAssignBudgetCode(user)).toBe(false)
    })
  })
})
