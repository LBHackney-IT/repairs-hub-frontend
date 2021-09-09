import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from './user'

export const HEADER_LINKS = [
  {
    href: '',
    id: 'manage',
    description: 'Manage work orders',
    permittedRoles: [
      CONTRACTOR_ROLE,
      CONTRACT_MANAGER_ROLE,
      AUTHORISATION_MANAGER_ROLE,
    ],
  },
  {
    href: 'search',
    id: 'search',
    description: 'Search',
    permittedRoles: [
      AGENT_ROLE,
      CONTRACTOR_ROLE,
      CONTRACT_MANAGER_ROLE,
      AUTHORISATION_MANAGER_ROLE,
    ],
  },
  {
    href: 'logout',
    id: 'signout',
    description: 'Sign out',
    permittedRoles: [
      AGENT_ROLE,
      CONTRACTOR_ROLE,
      CONTRACT_MANAGER_ROLE,
      AUTHORISATION_MANAGER_ROLE,
      OPERATIVE_ROLE,
    ],
  },
]
