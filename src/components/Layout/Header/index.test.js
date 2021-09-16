import { render } from '@testing-library/react'
import Header from '.'
import UserContext from '../../UserContext'
import { agentAndContractor } from 'factories/agent_and_contractor'

describe('Header', () => {
  const serviceName = 'Hackney Header'

  describe('When user is signed in', () => {
    it('should render header content with links', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: agentAndContractor,
          }}
        >
          <Header
            serviceName={serviceName}
            toggleMobileMenu={jest.fn()}
            mobileMenuOpen={false}
          />
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
          <Header
            serviceName={serviceName}
            toggleMobileMenu={jest.fn()}
            mobileMenuOpen={false}
          />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).not.toBeInTheDocument()
      expect(queryByText('Search')).not.toBeInTheDocument()
      expect(queryByText('Manage work orders')).not.toBeInTheDocument()
    })
  })
})
