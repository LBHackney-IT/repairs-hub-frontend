import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { agentAndContractor } from 'factories/agent_and_contractor'
import { operative } from 'factories/operative'

const SUPPORT_LINK = 'https://sites.google.com/hackney.gov.uk/repairshubsupport'

const SEARCH = { description: 'Search', href: '/search' }
const MANAGE = { description: 'Manage work orders', href: '/' }
const SIGN_OUT = { description: 'Sign out', href: '/api/logout' }

let headerLinksForUser: typeof import('./headerLinks').headerLinksForUser

// The user factories are untyped JS
const linksFor = (user: unknown) =>
  headerLinksForUser(user as { roles: string[] })

describe('headerLinksForUser', () => {
  // The support href is read from the env when the module loads
  beforeAll(async () => {
    process.env.NEXT_PUBLIC_SUPPORT_LINK = SUPPORT_LINK
    ;({ headerLinksForUser } = await import('./headerLinks'))
  })

  it.each([
    ['an agent', agent, [SEARCH, SIGN_OUT]],
    [
      'an operative',
      operative,
      [
        {
          description: 'Cautionary Alerts',
          href: '/work-orders/cautionary-alerts',
        },
        { description: 'Support', href: SUPPORT_LINK },
        SIGN_OUT,
      ],
    ],
    ['a contractor', contractor, [MANAGE, SEARCH, SIGN_OUT]],
    ['an agent and contractor', agentAndContractor, [MANAGE, SEARCH, SIGN_OUT]],
    ['a contract manager', contractManager, [MANAGE, SEARCH, SIGN_OUT]],
    [
      'an authorisation manager',
      authorisationManager,
      [MANAGE, SEARCH, SIGN_OUT],
    ],
  ])('returns the relevant links for %s', (_role, user, expected) => {
    expect(linksFor(user)).toEqual(
      expected.map((link) => expect.objectContaining(link))
    )
  })

  // Signing out has to be a full page load so the cleared cookies are picked up
  it('makes sign out a full page load', () => {
    const signOut = linksFor(agent).find((link) => link.id === 'signout')

    expect(signOut).toMatchObject({
      href: '/api/logout',
      requireFullPageLoad: true,
    })
  })
})
