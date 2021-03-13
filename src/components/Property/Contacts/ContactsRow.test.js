import { render } from '@testing-library/react'
import ContactsRow from './ContactsRow'

describe('ContactsRow component', () => {
  const contact = {
    firstName: 'Hugo Neves',
    lastName: 'Ferreira',
    phoneNumbers: ['00000111111', '', '00000333333'],
  }

  it('renders the name and available phone numbers in a row', async () => {
    const table = document.createElement('table')
    const tbody = document.createElement('tbody')

    table.appendChild(tbody)

    render(<ContactsRow contact={contact} />, {
      container: document.body.appendChild(tbody),
    })

    expect(tbody).toMatchInlineSnapshot(`
      <tbody>
        <tr
          class="govuk-table__row"
        >
          <td
            class="govuk-table__cell"
          >
            Hugo Neves Ferreira
          </td>
          <td
            class="govuk-table__cell"
          >
            00000111111
          </td>
          <td
            class="govuk-table__cell"
          />
          <td
            class="govuk-table__cell"
          >
            00000333333
          </td>
        </tr>
      </tbody>
    `)
  })
})
