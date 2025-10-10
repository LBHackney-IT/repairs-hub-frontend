import {
  STATUS_CANCELLED,
  STATUS_VARIATION_PENDING_APPROVAL,
  STATUS_AUTHORISATION_PENDING_APPROVAL,
  WORK_ORDERS_STATUSES,
} from './statusCodes'

import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
} from './user'

export const WORK_ORDER_ACTIONS = [
  {
    href: 'update',
    title: 'Update',
    description: 'Update Work Order',
    permittedRoles: [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE],
    permittedStatuses: WORK_ORDERS_STATUSES,
  },
  {
    href: 'close',
    title: 'Close',
    description: 'Close Work Order',
    permittedRoles: [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE],
    permittedStatuses: WORK_ORDERS_STATUSES,
  },
  {
    href: 'variation-authorisation',
    title: 'Variation Authorisation',
    description: 'Authorise Work Order Variation',
    permittedRoles: [CONTRACT_MANAGER_ROLE],
    permittedStatuses: WORK_ORDERS_STATUSES.filter((status) => {
      return status === STATUS_VARIATION_PENDING_APPROVAL.description
    }),
  },
  {
    href: 'authorisation',
    title: 'Authorisation',
    description: 'Authorise Work Order',
    permittedRoles: [AUTHORISATION_MANAGER_ROLE],
    permittedStatuses: WORK_ORDERS_STATUSES.filter((status) => {
      return status === STATUS_AUTHORISATION_PENDING_APPROVAL.description
    }),
  },
  {
    href: 'cancel',
    title: 'Cancel',
    description: 'Cancel Work Order',
    permittedRoles: [
      AGENT_ROLE,
      AUTHORISATION_MANAGER_ROLE,
      CONTRACT_MANAGER_ROLE,
    ],
    permittedStatuses: WORK_ORDERS_STATUSES.filter((status) => {
      return status !== STATUS_CANCELLED.description
    }),
  },
  {
    href: 'print',
    title: 'Print',
    description: 'Print Job Ticket',
    permittedRoles: [
      AGENT_ROLE,
      AUTHORISATION_MANAGER_ROLE,
      CONTRACT_MANAGER_ROLE,
      CONTRACTOR_ROLE,
    ],
    permittedStatuses: WORK_ORDERS_STATUSES,
  },
  // {
  //   href: 'edit',
  //   title: 'Edit',
  //   description: 'Edit Work Order',
  //   permittedRoles: [
  //     AGENT_ROLE,
  //     AUTHORISATION_MANAGER_ROLE,
  //     CONTRACT_MANAGER_ROLE,
  //     DATA_ADMIN_ROLE,
  //   ],
  //   permittedStatuses: WORK_ORDERS_STATUSES,
  // },
]
