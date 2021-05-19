import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import Search from './Search'

describe('Search component', () => {
  describe('when logged in as an agent', () => {
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

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an authorisation manager', () => {
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
