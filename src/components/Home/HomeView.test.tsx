import { render, screen } from '@testing-library/react'
import UserContext from '../UserContext'
import HomeView from './HomeView'
import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { multipleContractor } from 'factories/multiple_contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { agentAndContractor } from 'factories/agent_and_contractor'
import { authorisationManagerAndContractor } from 'factories/authorisation_manager_and_contractor'
import { operative } from 'factories/operative'

const mockCurrentUser = { name: 'Current Operative' }

jest.mock('@/components/WorkOrders/WorkOrdersView', () => ({
  __esModule: true,
  default: ({ query }) => (
    <div data-testid="work-orders-view">{JSON.stringify(query)}</div>
  ),
}))

jest.mock('../Search/Search', () => ({
  __esModule: true,
  default: ({ query }) => <div data-testid="search">{JSON.stringify(query)}</div>,
}))

jest.mock(
  '../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView',
  () => ({
    __esModule: true,
    default: ({ currentUser }) => (
      <div data-testid="operative-view">{currentUser.name}</div>
    ),
  })
)

jest.mock('../WorkOrders/CurrentUserWrapper', () => ({
  __esModule: true,
  default: ({ children }) => children({ currentUser: mockCurrentUser }),
}))

const renderHomeView = (user, query = {}) =>
  render(
    <UserContext.Provider value={{ user }}>
      <HomeView query={query} />
    </UserContext.Provider>
  )

const expectOnlyView = (testId) => {
  const views = ['work-orders-view', 'operative-view', 'search']

  views.forEach((view) => {
    if (view === testId) {
      expect(screen.getByTestId(view)).toBeInTheDocument()
    } else {
      expect(screen.queryByTestId(view)).not.toBeInTheDocument()
    }
  })
}

describe('HomeView component', () => {
  describe.each([
    ['a contractor', contractor],
    ['a contractor with multiple contractor groups', multipleContractor],
    ['a contract manager', contractManager],
    ['an authorisation manager', authorisationManager],
    ['an agent and contractor', agentAndContractor],
    [
      'an authorisation manager and contractor',
      authorisationManagerAndContractor,
    ],
    [
      'a contract manager and contractor',
      { ...contractManager, hasContractorPermissions: true },
    ],
  ])('when logged in as %s', (_, user) => {
    it('shows the work orders list', () => {
      renderHomeView(user)

      expectOnlyView('work-orders-view')
    })
  })

  describe('when logged in as an operative', () => {
    it('shows the operative view with the current user', () => {
      renderHomeView(operative)

      expectOnlyView('operative-view')
      expect(screen.getByTestId('operative-view')).toHaveTextContent(
        mockCurrentUser.name
      )
    })
  })

  describe('when logged in as an agent', () => {
    it('shows the search page', () => {
      renderHomeView(agent)

      expectOnlyView('search')
    })
  })

  describe('when there is no user', () => {
    it('shows the search page', () => {
      renderHomeView(undefined)

      expectOnlyView('search')
    })
  })

  describe('query', () => {
    const query = { StatusCode: '80', pageNumber: '2' }

    it('is passed to the work orders list', () => {
      renderHomeView(contractManager, query)

      expect(screen.getByTestId('work-orders-view')).toHaveTextContent(
        JSON.stringify(query)
      )
    })

    it('is passed to search', () => {
      renderHomeView(agent, query)

      expect(screen.getByTestId('search')).toHaveTextContent(
        JSON.stringify(query)
      )
    })
  })
})
