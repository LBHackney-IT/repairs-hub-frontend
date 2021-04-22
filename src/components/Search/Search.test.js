import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import Search from './Search'

describe('Search component', () => {
  describe('when logged in as an agent', () => {
    const user = {
      name: 'An Agent',
      email: 'an.agent@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: true,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contract manager', () => {
    const user = {
      name: 'A contract manager',
      email: 'a.contract-manager@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contractor', () => {
    const user = {
      name: 'An Agent',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
