import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
  ALL_ROLES,
  DATA_ADMIN_ROLE,
  CONTRACT_ADMIN_ROLE,
} from './user'

type HeaderLink = {
  href: string
  id: string
  description: string
  requireFullPageLoad: boolean
  permittedRoles: string[]
}

// Needs a real anchor, not a client side transition: the API route clears the
// session cookies and redirects through Cognito's logout
const SIGN_OUT_LINK: HeaderLink = {
  href: '/api/logout',
  id: 'signout',
  description: 'Sign out',
  requireFullPageLoad: true,
  permittedRoles: [...ALL_ROLES],
}

const HEADER_LINKS: HeaderLink[] = [
  {
    href: '/',
    id: 'manage',
    description: 'Manage work orders',
    requireFullPageLoad: false,
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
    requireFullPageLoad: false,
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
    requireFullPageLoad: false,
    permittedRoles: [OPERATIVE_ROLE],
  },

  {
    href: process.env.NEXT_PUBLIC_SUPPORT_LINK,
    id: 'support-page',
    description: 'Support',
    // External link
    requireFullPageLoad: true,
    permittedRoles: [OPERATIVE_ROLE],
  },
  {
    href: '/contracts-dashboard',
    id: 'contracts-dashboard',
    description: 'Contracts Dashboard',
    requireFullPageLoad: false,
    permittedRoles: [DATA_ADMIN_ROLE, CONTRACT_ADMIN_ROLE],
  },
  SIGN_OUT_LINK,
]

const toHeaderLink = (link: HeaderLink) => ({
  href: link.href,
  id: link.id,
  description: link.description,
  requireFullPageLoad: link.requireFullPageLoad,
})

export const headerLinksForUser = (
  user: { roles: string[] } | null,
  pathname: string
) => {
  // Every page except /login needs a session, so with no user on any other page
  // the visitor is signed in but has no role (the Access denied page). All they
  // can do is leave.
  if (!user) {
    return pathname === '/login' ? [] : [toHeaderLink(SIGN_OUT_LINK)]
  }

  return HEADER_LINKS.filter((link) =>
    link.permittedRoles.some((role) => user.roles.includes(role))
  ).map(toHeaderLink)
}
