import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import Search from './Search'
import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'

describe('Search component', () => {
  describe('when logged in as an agent', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contractor', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractor }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contract manager', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManager }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an authorisation manager', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: authorisationManager }}>
          <Search />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
