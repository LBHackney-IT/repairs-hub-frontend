import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
  ALL_ROLES,
  DATA_ADMIN_ROLE,
} from './user'

const HEADER_LINKS = [
  {
    href: '/',
    id: 'manage',
    description: 'Manage work orders',
    permittedRoles: [
      CONTRACTOR_ROLE,
      CONTRACT_MANAGER_ROLE,
      AUTHORISATION_MANAGER_ROLE,
    ],
  },
  {
    href: '/search',
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
    href: '/work-orders/cautionary-alerts',
    id: 'cautionary-alerts',
    description: 'Cautionary Alerts',
    permittedRoles: [OPERATIVE_ROLE],
  },

  {
    href: process.env.NEXT_PUBLIC_SUPPORT_LINK,
    id: 'support-page',
    description: 'Support',
    permittedRoles: [OPERATIVE_ROLE],
  },
  {
    href: '/contracts-dashboard',
    id: 'contracts-dashboard',
    description: 'Contracts Dashboard',
    permittedRoles: [DATA_ADMIN_ROLE],
  },
  {
    href: '/logout',
    id: 'signout',
    description: 'Sign out',
    permittedRoles: [...ALL_ROLES],
  },
]

export const headerLinksForUser = (user) => {
  return HEADER_LINKS.filter((link) =>
    link.permittedRoles.some((role) => user.roles.includes(role))
  ).map((link) => {
    return {
      href: link.href,
      id: link.id,
      description: link.description,
    }
  })
}
