import { render } from '@testing-library/react'
import Header from './Header'
import UserContext from '../../UserContext/UserContext'

describe('Header', () => {
  const serviceName = 'Hackney Header'

  describe('When user is signed in', () => {
    it('should render header content for agents', () => {
      const user = {
        name: 'An Agent',
        email: 'an.agent@hackney.gov.uk',
        roles: ['agent'],
        hasRole: true,
        hasAgentPermissions: true,
        hasContractorPermissions: false,
        hasContractManagerPermissions: false,
        hasAuthorisationManagerPermissions: false,
        hasAnyPermissions: true,
      }

      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: user,
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
      const user = {
        name: 'A Contractor',
        email: 'a.contractor@hackney.gov.uk',
        roles: ['contractor'],
        hasRole: true,
        hasAgentPermissions: false,
        hasContractorPermissions: true,
        hasContractManagerPermissions: false,
        hasAuthorisationManagerPermissions: false,
        hasAnyPermissions: true,
      }

      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: user,
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
      const user = {
        name: 'An Operative',
        email: 'an.operative@hackney.gov.uk',
        roles: ['agent', 'contractor'],
        hasRole: true,
        hasAgentPermissions: true,
        hasContractorPermissions: true,
        hasContractManagerPermissions: false,
        hasAuthorisationManagerPermissions: false,
        hasAnyPermissions: true,
      }

      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: user,
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
      const user = {
        name: 'A Contract Manager',
        email: 'a.contract_manager@hackney.gov.uk',
        roles: ['contract_manager'],
        hasRole: true,
        hasAgentPermissions: false,
        hasContractorPermissions: false,
        hasContractManagerPermissions: true,
        hasAuthorisationManagerPermissions: false,
        hasAnyPermissions: true,
      }

      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: user,
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
      const user = {
        name: 'An Authorisation Manager',
        email: 'a.authorisation_manager@hackney.gov.uk',
        roles: ['authorisation_manager'],
        hasRole: true,
        hasAgentPermissions: false,
        hasContractorPermissions: false,
        hasContractManagerPermissions: false,
        hasAuthorisationManagerPermissions: true,
        hasAnyPermissions: true,
      }

      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: user,
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
