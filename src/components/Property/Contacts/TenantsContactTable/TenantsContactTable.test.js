import { render } from '@testing-library/react'
import TenantsContactTable from './TenantsContactTable'

describe('TenantsContactTable component', () => {
  describe('when supplied with an empty tenants list', () => {
    const tenants = []

    it('renders text indicating that no tenants are available', () => {
      const { asFragment } = render(<TenantsContactTable tenants={tenants} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when supplied with a tenant with no phone numbers', () => {
    const tenants = [
      {
        fullName: 'Mark Gardner',
        personId: '1234',
        phoneNumbers: [],
      },
    ]

    it('renders text indicating that no phone numbers are available', () => {
      const { asFragment } = render(<TenantsContactTable tenants={tenants} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when supplied with a list of tenants with phone numbers', () => {
    const tenants = [
      {
        fullName: 'Mark Gardner',
        personId: '1234',
        phoneNumbers: [
          { value: '00000111111', subType: 'mainNumber', description: 'desc1' },
          { value: '00000222222', subType: 'wife', description: 'desc2' },
          { value: '00000333333', subType: 'doctor', description: 'desc3' },
        ],
      },
      {
        fullName: 'Luam Berhane',
        personId: '1234',
        phoneNumbers: [
          { value: '', subType: 'mainNumber', description: '' },
          { value: '', subType: 'mainNumber', description: '' },
          { value: '00000333333', subType: 'mainNumber', description: '' },
        ],
      },
    ]

    it('renders a table with a row for each contact', () => {
      const { asFragment } = render(<TenantsContactTable tenants={tenants} />)

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
