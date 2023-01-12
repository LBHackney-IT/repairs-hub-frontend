import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { agentAndContractor } from 'factories/agent_and_contractor'
import { operative } from 'factories/operative'

import { headerLinksForUser } from './headerLinks'

describe('headerLinksForUser', () => {
  describe('when the user is an agent', () => {
    it('returns relevant links', () => {
      const links = headerLinksForUser(agent)

      expect(links).toEqual([
        expect.objectContaining({
          description: 'Search',
          href: '/search',
        }),
        expect.objectContaining({
          description: 'Sign out',
          href: '/logout',
        }),
      ])
    })
  })

  describe('when the user is an operative', () => {
    it('returns relevant links', () => {
      const links = headerLinksForUser(operative)

      expect(links).toEqual([
        expect.objectContaining({
          description: 'Cautionary Alerts',
          href: '/work-orders/cautionary-alerts',
        }),
        expect.objectContaining({
          description: 'Support',
          href: 'https://sites.google.com/hackney.gov.uk/repairshubsupport',
        }),
        expect.objectContaining({
          description: 'Sign out',
          href: '/logout',
        }),
      ])
    })
  })

  describe('when the user is an contractor', () => {
    it('returns relevant links', () => {
      const links = headerLinksForUser(contractor)

      expect(links).toEqual([
        expect.objectContaining({
          description: 'Manage work orders',
          href: '/',
        }),
        expect.objectContaining({
          description: 'Search',
          href: '/search',
        }),
        expect.objectContaining({
          description: 'Sign out',
          href: '/logout',
        }),
      ])
    })
  })

  describe('when the user is an DLO operative', () => {
    it('returns relevant links', () => {
      const links = headerLinksForUser(agentAndContractor)

      expect(links).toEqual([
        expect.objectContaining({
          description: 'Manage work orders',
          href: '/',
        }),
        expect.objectContaining({
          description: 'Search',
          href: '/search',
        }),
        expect.objectContaining({
          description: 'Sign out',
          href: '/logout',
        }),
      ])
    })
  })

  describe('when the user is a contract manager', () => {
    it('returns relevant links', () => {
      const links = headerLinksForUser(contractManager)

      expect(links).toEqual([
        expect.objectContaining({
          description: 'Manage work orders',
          href: '/',
        }),
        expect.objectContaining({
          description: 'Search',
          href: '/search',
        }),
        expect.objectContaining({
          description: 'Sign out',
          href: '/logout',
        }),
      ])
    })
  })

  describe('when the user is an authorisation manager', () => {
    it('returns relevant links', () => {
      const links = headerLinksForUser(authorisationManager)

      expect(links).toEqual([
        expect.objectContaining({
          description: 'Manage work orders',
          href: '/',
        }),
        expect.objectContaining({
          description: 'Search',
          href: '/search',
        }),
        expect.objectContaining({
          description: 'Sign out',
          href: '/logout',
        }),
      ])
    })
  })
})
