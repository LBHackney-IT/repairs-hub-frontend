import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserContext from '../UserContext'
import Search from './Search'
import { agent } from 'factories/agent'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'

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

  it('disables search button when input is empty or one character', async () => {
    render(
      <UserContext.Provider value={{ user: agent }}>
        <Search />
      </UserContext.Provider>
    )

    const searchButton = screen.getByRole('button', { name: 'Search' })
    const searchInput = screen.getByTestId('input-search') as HTMLInputElement

    // Enabled with two characters
    fireEvent.change(searchInput, { target: { value: 'ab' } })
    await waitFor(() => expect(searchButton).not.toBeDisabled())

    // Disabled with one character
    fireEvent.change(searchInput, { target: { value: 'a' } })
    await waitFor(() => expect(searchButton).toBeDisabled())

    // Disabled when empty
    fireEvent.change(searchInput, { target: { value: '' } })
    await waitFor(() => expect(searchButton).toBeDisabled())
  })
})
