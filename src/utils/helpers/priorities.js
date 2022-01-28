export const IMMEDIATE_PRIORITY_CODE = 1
export const EMERGENCY_PRIORITY_CODE = 2
export const URGENT_PRIORITY_CODE = 3
export const NORMAL_PRIORITY_CODE = 4

export const HIGH_PRIORITY_CODES = [
  IMMEDIATE_PRIORITY_CODE,
  EMERGENCY_PRIORITY_CODE,
]

// These are codes which should result in using the RH
// booking calendar if the order is for an external contractor
export const PRIORITY_CODES_REQUIRING_APPOINTMENTS = [
  URGENT_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
]
