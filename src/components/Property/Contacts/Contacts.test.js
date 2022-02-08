import { render } from '@testing-library/react'
import Contacts from './Contacts'

describe('Contacts component', () => {
  describe('when supplied with an empty contacts list', () => {
    const contacts = []

    it('renders text indicating that no contacts are available', () => {
      const { asFragment } = render(<Contacts contacts={contacts} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when supplied with a list of contacts', () => {
    const contacts = [
      {
        firstName: 'Mark',
        lastName: 'Gardner',
        phoneNumbers: ['00000111111', '00000222222', '00000333333'],
      },
      {
        firstName: 'Luam',
        lastName: 'Berhane',
        phoneNumbers: ['', '', '00000333333'],
      },
    ]

    it('renders a table with a row for each contact', () => {
      const { asFragment } = render(<Contacts contacts={contacts} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
