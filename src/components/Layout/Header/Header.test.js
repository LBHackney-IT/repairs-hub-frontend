import { render } from '@testing-library/react'
import Header from './Header'
import UserContext from '../../UserContext/UserContext'

describe('Header', () => {
  const serviceName = 'Hackney Header'

  describe('When user is logged in', () => {
    it('should render header content for agents', () => {
      const user = {
        name: 'An Agent',
        email: 'an.agent@hackney.gov.uk',
        hasRole: true,
        hasAgentPermissions: true,
        hasContractorPermissions: false,
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
      expect(queryByText('Logout')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage jobs')).not.toBeInTheDocument()
    })

    it('should render header content for contractors', () => {
      const user = {
        name: 'A Contractor',
        email: 'a.contractor@hackney.gov.uk',
        hasRole: true,
        hasAgentPermissions: false,
        hasContractorPermissions: true,
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
      expect(queryByText('Logout')).toBeInTheDocument()
      expect(queryByText('Search')).toBeInTheDocument()
      expect(queryByText('Manage jobs')).toBeInTheDocument()
    })
  })

  describe('When user is not logged in', () => {
    it('should render service name without logout link', () => {
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
      expect(queryByText('Logout')).not.toBeInTheDocument()
      expect(queryByText('Search')).not.toBeInTheDocument()
      expect(queryByText('Manage jobs')).not.toBeInTheDocument()
    })
  })
})
