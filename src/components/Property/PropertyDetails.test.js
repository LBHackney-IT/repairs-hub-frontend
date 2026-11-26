import { render, screen } from '@testing-library/react'
import PropertyDetails from './PropertyDetails'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('PropertyDetails component', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

  const props = {
    property: {
      propertyReference: '00012345',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
        addressLine: '16 Pitcairn House',
        streetSuffix: 'St Thomass Square',
      },
      hierarchyType: {
        subTypeDescription: 'Dwelling',
      },
      canRaiseRepair: true,
    },
    tenure: {
      id: 'tenureId1',
      typeCode: 'SEC',
      typeDescription: 'Secure',
      tenancyAgreementReference: 'tenancyAgreementRef1',
    },
    warrantyStatus: null,
  }

  describe('when the date is before out of hours does not show the link', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('Thursday 16 September 2021 13:01:00'))
    })
    afterAll(() => {
      jest.useRealTimers()
    })

    it('should render properly', async () => {
      const { asFragment } = render(
        <PropertyDetails
          property={props.property}
          tenure={props.tenure}
          showLegalDisrepairFlag={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the date is after out of hours should show the link', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('Thursday 16 September 2021 18:01:00'))
    })
    afterAll(() => {
      jest.useRealTimers()
    })

    it('should render properly', async () => {
      const { asFragment } = render(
        <PropertyDetails
          property={props.property}
          tenure={props.tenure}
          showLegalDisrepairFlag={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('warrantyStatus flag', () => {
    const originalSpreadsheetId =
      process.env.NEXT_PUBLIC_WARRANTIES_SPREADSHEET_ID

    beforeEach(() => {
      process.env.NEXT_PUBLIC_WARRANTIES_SPREADSHEET_ID = 'test-spreadsheet-id'
    })

    afterEach(() => {
      process.env.NEXT_PUBLIC_WARRANTIES_SPREADSHEET_ID = originalSpreadsheetId
    })

    it('hides warranty/defects notice when warrantyStatus is null', async () => {
      render(
        <PropertyDetails
          property={{ ...props.property }}
          tenure={props.tenure}
        />
      )

      await screen.findByRole('heading', {
        name: /Dwelling: 16 Pitcairn House/,
      })

      expect(
        screen.queryByText('Property under warranty period')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('Property under defects period')
      ).not.toBeInTheDocument()
    })

    it('shows warranty notice when warrantyStatus is WARRANTIES', async () => {
      render(
        <PropertyDetails
          property={{ ...props.property, warrantyStatus: 'WARRANTIES' }}
          tenure={props.tenure}
        />
      )

      expect(
        await screen.findByText('Property under warranty period')
      ).toBeInTheDocument()
      expect(
        screen.getByText(/This property is currently under a warranty period/)
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', {
          name: 'New Property Warranties Spreadsheet',
        })
      ).toHaveAttribute(
        'href',
        'https://docs.google.com/spreadsheets/d/test-spreadsheet-id?gid=0'
      )
    })

    it('shows defects notice when warrantyStatus is DEFECTS', async () => {
      render(
        <PropertyDetails
          property={{ ...props.property, warrantyStatus: 'DEFECTS' }}
          tenure={props.tenure}
        />
      )

      expect(
        await screen.findByText('Property under defects period')
      ).toBeInTheDocument()
      expect(
        screen.getByText(/This property is currently under a defects period/)
      ).toBeInTheDocument()
    })

    it('shows error notice when warrantyStatus is invalid', async () => {
      render(
        <PropertyDetails
          property={{ ...props.property, warrantyStatus: 'blah' }}
          tenure={props.tenure}
        />
      )

      expect(
        await screen.findByText('Error: Invalid Defects & Warranties Status')
      ).toBeInTheDocument()
      expect(screen.getByText(/Invalid status:/)).toBeInTheDocument()
    })
  })
})
