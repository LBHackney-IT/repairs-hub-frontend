import { render } from '@testing-library/react'
import Header from './Header'
import UserContext from '../../UserContext/UserContext'
import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { agentAndContractor } from 'factories/agent_and_contractor'

describe('Header', () => {
  const serviceName = 'Hackney Header'

  describe('When user is signed in', () => {
    it('should render header content for agents', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: agent,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage work orders')).not.toBeInTheDocument()
    })

    it('should render header content for contractors', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: contractor,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage work orders')).toBeInTheDocument()
    })

    it('should render header content for DLO operatives', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: agentAndContractor,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage work orders')).toBeInTheDocument()
    })

    it('should render header content for contract manager', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: contractManager,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage work orders')).toBeInTheDocument()
    })

    it('should render header content for authorisation manager', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: authorisationManager,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage work orders')).toBeInTheDocument()
    })
  })

  describe('When user is not signed in', () => {
    it('should render service name without signed out link', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: null,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).not.toBeInTheDocument()
      expect(queryByText('Search')).not.toBeInTheDocument()
      expect(queryByText('Manage work orders')).not.toBeInTheDocument()
    })
  })
})
