export const STATUS_IN_PROGRESS = {
  code: 80,
  description: 'In Progress',
}

export const STATUS_COMPLETE = {
  code: 50,
  description: 'Complete',
}

export const STATUS_CANCELLED = {
  code: 30,
  description: 'Work Cancelled',
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

export const WORK_ORDERS_STATUSES = [
  STATUS_IN_PROGRESS.description,
  STATUS_COMPLETE.description,
  STATUS_CANCELLED.description,
  STATUS_VARIATION_PENDING_APPROVAL.description,
  STATUS_AUTHORISATION_PENDING_APPROVAL.description,
  STATUS_VARIATION_APPROVED.description,
  STATUS_VARIATION_REJECTED.description,
]
