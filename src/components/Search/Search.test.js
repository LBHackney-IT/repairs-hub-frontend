import { render, screen } from '@testing-library/react'
import UserContext from '../UserContext'
import Search from './Search'
import { agent } from 'factories/agent'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Search component', () => {
  ;[agent, contractManager, authorisationManager].forEach((role) => {
    describe(`when logged in as ${role}`, () => {
      it('contains text to show that all search types are possible', () => {
        render(
          <UserContext.Provider value={{ user: role }}>
            <Search />
          </UserContext.Provider>
        )

        screen.getByRole('heading', {
          name: 'Find repair work order or property',
        })

        screen.getByLabelText(
          'Search by work order reference, postcode or address'
        )
      })
    })
  })

  it('renders a search form', () => {
    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <Search />
      </UserContext.Provider>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
