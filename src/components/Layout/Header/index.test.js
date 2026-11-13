import { render } from '@testing-library/react'
import { useRouter } from 'next/router'
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

  describe('When there is no user', () => {
    const renderHeader = (pathname) => {
      useRouter.mockReturnValue({ pathname })

      return render(
        <UserContext.Provider value={{ user: null }}>
          <Header
            serviceName={serviceName}
            toggleMobileMenu={jest.fn()}
            mobileMenuOpen={false}
          />
        </UserContext.Provider>
      )
    }

    afterEach(() => {
      useRouter.mockReturnValue({ pathname: '/' })
    })

    it('should render the service name without links on the login page', () => {
      const { getByText, queryByText } = renderHeader('/login')

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).not.toBeInTheDocument()
      expect(queryByText('Search')).not.toBeInTheDocument()
      expect(queryByText('Manage work orders')).not.toBeInTheDocument()
    })

    // Signed in but with no role: the Access denied page has no user
    it('should offer only a sign out link anywhere else', () => {
      const { getByText, queryByText } = renderHeader('/access-denied')

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Sign out')).toBeInTheDocument()
      expect(queryByText('Search')).not.toBeInTheDocument()
      expect(queryByText('Manage work orders')).not.toBeInTheDocument()
    })
  })
})
