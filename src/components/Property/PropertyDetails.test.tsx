import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import PropertyDetails from './PropertyDetails'
import { isCurrentTimeOutOfHours } from '@/utils/helpers/completionDateTimes'
import { Property, Tenure } from '@/models/propertyTenure'
import { CautionaryAlert } from '@/models/cautionaryAlerts'

jest.mock('@/utils/helpers/completionDateTimes')

const mockIsCurrentTimeOutOfHours = isCurrentTimeOutOfHours as jest.Mock

const property = {
  propertyReference: '00012345',
  address: {
    shortAddress: '16 Pitcairn House  St Thomass Square',
    postalCode: 'E9 6PT',
    addressLine: '16 Pitcairn House',
    streetSuffix: 'St Thomass Square',
  },
  hierarchyType: {
    levelCode: '7',
    subTypeCode: 'DWE',
    subTypeDescription: 'Dwelling',
  },
  canRaiseRepair: true,
  isUnderWarranty: false,
} as Property

const tenure = {
  typeCode: 'SEC',
  typeDescription: 'Secure',
} as Tenure

const alerts: CautionaryAlert[] = [
  {
    type: 'VA',
    comments: 'Verbal abuse',
    startDate: '2024-01-01',
    endDate: null,
  },
]

const renderPropertyDetails = (
  props: Partial<ComponentProps<typeof PropertyDetails>> = {}
) =>
  render(
    <PropertyDetails
      property={property}
      tenure={tenure}
      alerts={[]}
      alertsLoading={false}
      alertsError={null}
      {...props}
    />
  )

const LEGAL_DISREPAIR_FLAG = 'This property is currently under legal disrepair'
const UNDER_WARRANTY_FLAG = 'This property is under warranty'
const HEALTH_AND_SAFETY_FLAG = 'Health & Safety Hazard'

describe('PropertyDetails component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockIsCurrentTimeOutOfHours.mockReturnValue(false)
  })

  it('shows the property type and address in the heading', () => {
    renderPropertyDetails()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Dwelling: 16 Pitcairn House',
      })
    ).toBeInTheDocument()
  })

  it('shows the address', () => {
    renderPropertyDetails()

    // The address lines are separated by <br>s within one element
    const address = screen.getByText('E9 6PT').parentElement

    expect(address).toHaveTextContent('16 Pitcairn House')
    expect(address).toHaveTextContent('St Thomass Square')
  })

  describe('raising a work order', () => {
    it('links to raise a work order when the property allows it', () => {
      renderPropertyDetails()

      expect(
        screen.getByRole('link', {
          name: 'Raise a work order on this dwelling',
        })
      ).toHaveAttribute('href', '/properties/00012345/raise-repair/new')
    })

    it('warns that a work order cannot be raised when the property does not allow it', () => {
      renderPropertyDetails({
        property: { ...property, canRaiseRepair: false },
      })

      expect(
        screen.getByText(
          'Cannot raise a work order on this property due to tenure type'
        )
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: /Raise a work order/ })
      ).not.toBeInTheDocument()
    })
  })

  describe('out of hours note', () => {
    it('is shown out of hours', () => {
      mockIsCurrentTimeOutOfHours.mockReturnValue(true)

      renderPropertyDetails()

      expect(
        screen.getByRole('link', { name: 'Out of hours note' })
      ).toBeInTheDocument()
    })

    it('is not shown during working hours', () => {
      renderPropertyDetails()

      expect(
        screen.queryByRole('link', { name: 'Out of hours note' })
      ).not.toBeInTheDocument()
    })
  })

  describe('flags', () => {
    it('shows no flags by default', () => {
      renderPropertyDetails()

      expect(screen.queryByText(LEGAL_DISREPAIR_FLAG)).not.toBeInTheDocument()
      expect(screen.queryByText(UNDER_WARRANTY_FLAG)).not.toBeInTheDocument()
      expect(screen.queryByText(HEALTH_AND_SAFETY_FLAG)).not.toBeInTheDocument()
    })

    it('shows the legal disrepair flag', () => {
      renderPropertyDetails({ showLegalDisrepairFlag: true })

      expect(screen.getByText(LEGAL_DISREPAIR_FLAG)).toBeInTheDocument()
    })

    it('shows the legal disrepair error', () => {
      renderPropertyDetails({
        legalDisrepairError: 'Could not get legal disrepair status',
      })

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Could not get legal disrepair status'
      )
    })

    it('shows the under warranty flag', () => {
      renderPropertyDetails({ showUnderWarrantyFlag: true })

      expect(screen.getByText(UNDER_WARRANTY_FLAG)).toBeInTheDocument()
    })

    it('shows the health and safety flag with the property message', () => {
      renderPropertyDetails({
        property: {
          ...property,
          healthAndSafetyRatingMessage: 'Asbestos in loft',
        },
        showHealthAndSafetyFlag: true,
      })

      expect(screen.getByText(HEALTH_AND_SAFETY_FLAG)).toBeInTheDocument()
      expect(screen.getByText('Asbestos in loft')).toBeInTheDocument()
    })
  })

  describe('cautionary alerts', () => {
    it('shows the alerts', () => {
      renderPropertyDetails({ alerts })

      expect(screen.getByText('Verbal abuse')).toBeInTheDocument()
    })

    it('shows a spinner while the alerts are loading', () => {
      renderPropertyDetails({ alertsLoading: true })

      expect(screen.getByText('Fetching alerts…')).toBeInTheDocument()
    })

    it('shows the alerts error', () => {
      renderPropertyDetails({ alertsError: 'Could not get cautionary alerts' })

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Could not get cautionary alerts'
      )
    })
  })

  describe('tenure', () => {
    it('shows the tenure type', () => {
      renderPropertyDetails()

      expect(screen.getByText('Tenure: Secure')).toBeInTheDocument()
    })

    it('shows the TMO name', () => {
      renderPropertyDetails({
        property: { ...property, tmoName: 'Shoreditch TMO' },
      })

      expect(screen.getByText('TMO: Shoreditch TMO')).toBeInTheDocument()
    })
  })
})
