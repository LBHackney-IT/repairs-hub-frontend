export const STATUS_IN_PROGRESS = {
  code: 80,
  description: 'In Progress',
}

export const STATUS_COMPLETED = {
  code: 50,
  description: 'Work Completed',
}

export const STATUS_CANCELLED = {
  code: 30,
  description: 'Cancelled',
}

export const STATUS_VARIATION_PENDING_APPROVAL = {
  code: 90,
  description: 'Variation Pending Approval',
}

export const STATUS_AUTHORISATION_PENDING_APPROVAL = {
  code: 1010,
  description: 'Authorisation Pending Approval',
}

export const STATUS_VARIATION_APPROVED = {
  code: 1080,
  description: 'Variation Approved',
}

export const STATUS_VARIATION_REJECTED = {
  code: 1090,
  description: 'Variation Rejected',
}

export const STATUS_NO_ACCESS = {
  code: 1000,
  description: 'No Access',
}

export const CLOSURE_STATUS_OPTIONS = [
  {
    text: 'Completed',
    value: 'Work Order Completed',
  },
  {
    text: 'No access',
    value: 'No Access',
  },
]

export const WORK_ORDERS_STATUSES = [
  STATUS_IN_PROGRESS.description,
  STATUS_COMPLETED.description,
  STATUS_CANCELLED.description,
  STATUS_VARIATION_PENDING_APPROVAL.description,
  STATUS_AUTHORISATION_PENDING_APPROVAL.description,
  STATUS_VARIATION_APPROVED.description,
  STATUS_VARIATION_REJECTED.description,
  STATUS_NO_ACCESS.description,
]

export const CLOSED_STATUS_DESCRIPTIONS = [
  STATUS_CANCELLED.description,
  STATUS_AUTHORISATION_PENDING_APPROVAL.description,
  STATUS_COMPLETED.description,
  STATUS_NO_ACCESS.description,
]

export const CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES = [
  STATUS_COMPLETED.description,
  STATUS_NO_ACCESS.description,
]
