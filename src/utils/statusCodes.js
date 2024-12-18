export const STATUS_IN_PROGRESS = {
  code: 80,
  description: 'In Progress',
}

export const STATUS_COMPLETED = {
  code: 50,
  description: 'Completed',
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
    text: 'Visit completed',
    value: 'Work Order Completed',
  },
  {
    text: 'No access',
    value: 'No Access',
  },
]

export const FOLLOW_ON_STATUS_OPTIONS = [
  { value: 'noFurtherWorkRequired', text: 'No further work required' },
  {
    value: 'furtherWorkRequired',
    text: 'Further work required',
  },
]

// Value: value stored in DB
// Name: form field name
// Label: form field label
export const FOLLOW_ON_REQUEST_AVAILABLE_TRADES = [
  { name: 'followon-trades-carpentry', label: 'Carpentry', value: 'Carpentry' },
  { name: 'followon-trades-drainage', label: 'Drainage', value: 'Drainage' },
  { name: 'followon-trades-gas', label: 'Gas', value: 'Gas' },
  {
    name: 'followon-trades-electrical',
    label: 'Electrical',
    value: 'Electrical',
  },
  {
    name: 'followon-trades-multitrade',
    label: 'Multitrade',
    value: 'Multitrade',
  },
  { name: 'followon-trades-painting', label: 'Painting', value: 'Painting' },
  { name: 'followon-trades-plumbing', label: 'Plumbing', value: 'Plumbing' },
  { name: 'followon-trades-leakshub', label: 'Leaks Hub', value: 'LeaksHub' },
  { name: 'followon-trades-roofing', label: 'Roofing', value: 'Roofing' },
  {
    name: 'followon-trades-scaffolding',
    label: 'Scaffolding',
    value: 'Scaffolding',
  },
  { name: 'followon-trades-UPVC', label: 'UPVC', value: 'UPVC' },
  {
    name: 'followon-trades-surveyor-inspection',
    label: 'Surveyors Inspection',
    value: 'SurveyorsInspection',
  },
  {
    name: 'followon-trades-other',
    label: 'Other (please specify in the text box below)',
    value: 'Other',
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
  'Work Completed', // can be deleted following backend release of PR #641
]

export const CLOSED_STATUS_DESCRIPTIONS = [
  STATUS_CANCELLED.description,
  STATUS_AUTHORISATION_PENDING_APPROVAL.description,
  STATUS_COMPLETED.description,
  STATUS_NO_ACCESS.description,
  'Work Completed', // can be deleted following backend release of PR #641
]

export const CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES = [
  STATUS_COMPLETED.description,
  STATUS_NO_ACCESS.description,
  'Work Completed', // can be deleted following backend release of PR #641
]
