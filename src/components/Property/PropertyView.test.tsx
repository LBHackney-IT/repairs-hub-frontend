import { render, screen } from '@testing-library/react'
import PropertyView from './PropertyView'
import { usePropertyTenure } from '@/requests/hooks/usePropertyTenure'
import { useLegalDisrepairStatus } from '@/requests/hooks/useLegalDisrepairStatus'
import { useCautionaryAlerts } from '@/requests/hooks/useCautionaryAlerts'
import { useSimpleFeatureToggles } from '../../hooks/useSimpleFeatureToggle'
import { Property, Tenure } from '@/models/propertyTenure'
import { CautionaryAlert } from '@/models/cautionaryAlerts'

jest.mock('@/requests/hooks/usePropertyTenure')
jest.mock('@/requests/hooks/useLegalDisrepairStatus')
jest.mock('@/requests/hooks/useCautionaryAlerts')
jest.mock('../../hooks/useSimpleFeatureToggle')

// Renders the <title> into the document so document.title can be checked
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}))

// The history loads its own data, so stand in for it here
jest.mock('./WorkOrdersHistory/WorkOrdersHistoryView', () => ({
  __esModule: true,
  default: ({ propertyReference }) => (
    <div data-testid="work-orders-history">
      Work orders for {propertyReference}
    </div>
  ),
}))

const mockUsePropertyTenure = usePropertyTenure as jest.Mock
const mockUseLegalDisrepairStatus = useLegalDisrepairStatus as jest.Mock
const mockUseCautionaryAlerts = useCautionaryAlerts as jest.Mock
const mockUseSimpleFeatureToggles = useSimpleFeatureToggles as jest.Mock

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

const DETAILS_SPINNER = 'Fetching property details…'
const ALERTS_SPINNER = 'Fetching alerts…'
const PROPERTY_HEADING = 'Dwelling: 16 Pitcairn House'

// Every request has finished successfully unless a test overrides it
const mockHooks = ({
  propertyTenure = {},
  legalDisrepair = {},
  cautionaryAlerts = {},
  featureTogglesLoading = false,
}: {
  propertyTenure?: Partial<ReturnType<typeof usePropertyTenure>>
  legalDisrepair?: Partial<ReturnType<typeof useLegalDisrepairStatus>>
  cautionaryAlerts?: Partial<ReturnType<typeof useCautionaryAlerts>>
  featureTogglesLoading?: boolean
} = {}) => {
  mockUsePropertyTenure.mockReturnValue({
    property,
    tenure,
    error: null,
    isLoading: false,
    ...propertyTenure,
  })

  mockUseLegalDisrepairStatus.mockReturnValue({
    isInLegalDisrepair: false,
    error: null,
    isLoading: false,
    ...legalDisrepair,
  })

  mockUseCautionaryAlerts.mockReturnValue({
    alerts,
    error: null,
    isLoading: false,
    ...cautionaryAlerts,
  })

  mockUseSimpleFeatureToggles.mockReturnValue([
    featureTogglesLoading ? undefined : {},
    featureTogglesLoading,
    null,
  ])
}

const propertyLoading = {
  property: undefined,
  tenure: undefined,
  isLoading: true,
}

describe('PropertyView component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('requests the data for the given property', () => {
    mockHooks()

    render(<PropertyView propertyReference="00012345" />)

    expect(mockUsePropertyTenure).toHaveBeenCalledWith('00012345')
    expect(mockUseLegalDisrepairStatus).toHaveBeenCalledWith('00012345')
    expect(mockUseCautionaryAlerts).toHaveBeenCalledWith('00012345')
  })

  it('shows the address in the page title', () => {
    mockHooks()

    render(<PropertyView propertyReference="00012345" />)

    expect(document.title).toBe('16 Pitcairn House | Hackney Repairs Hub')
  })

  describe('while loading', () => {
    it.each([
      ['the property', { propertyTenure: propertyLoading }],
      ['the legal disrepair status', { legalDisrepair: { isLoading: true } }],
      ['the feature toggles', { featureTogglesLoading: true }],
    ])(
      'shows a spinner, without the property details, while waiting for %s',
      (_, loading) => {
        mockHooks(loading)

        render(<PropertyView propertyReference="00012345" />)

        expect(screen.getByText(DETAILS_SPINNER)).toBeInTheDocument()
        expect(screen.queryByText(PROPERTY_HEADING)).not.toBeInTheDocument()
      }
    )
  })

  it('shows the property details, without a spinner, once loaded', () => {
    mockHooks()

    render(<PropertyView propertyReference="00012345" />)

    expect(screen.getByText(PROPERTY_HEADING)).toBeInTheDocument()
    expect(screen.queryByText(DETAILS_SPINNER)).not.toBeInTheDocument()
  })

  describe('cautionary alerts', () => {
    it('shows the property details while the alerts are still loading', () => {
      mockHooks({ cautionaryAlerts: { alerts: [], isLoading: true } })

      render(<PropertyView propertyReference="00012345" />)

      expect(screen.getByText(PROPERTY_HEADING)).toBeInTheDocument()
      expect(screen.getByText(ALERTS_SPINNER)).toBeInTheDocument()
      expect(screen.queryByText(DETAILS_SPINNER)).not.toBeInTheDocument()
    })

    it('shows the alerts once loaded', () => {
      mockHooks()

      render(<PropertyView propertyReference="00012345" />)

      expect(screen.getByText('Verbal abuse')).toBeInTheDocument()
      expect(screen.queryByText(ALERTS_SPINNER)).not.toBeInTheDocument()
    })
  })

  describe('work order history', () => {
    it('is loaded, but hidden, while the property details are loading', () => {
      mockHooks({ propertyTenure: propertyLoading })

      render(<PropertyView propertyReference="00012345" />)

      const history = screen.getByTestId('work-orders-history')

      expect(history).toHaveTextContent('Work orders for 00012345')
      expect(history).not.toBeVisible()
    })

    it('is shown once the property details are loaded', () => {
      mockHooks()

      render(<PropertyView propertyReference="00012345" />)

      expect(screen.getByTestId('work-orders-history')).toBeVisible()
    })
  })

  describe('when the property request fails', () => {
    beforeEach(() => {
      mockHooks({
        propertyTenure: {
          property: undefined,
          tenure: undefined,
          error: 'Could not find a property with reference 00012345',
        },
      })
    })

    it('shows the error message', () => {
      render(<PropertyView propertyReference="00012345" />)

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Could not find a property with reference 00012345'
      )
    })

    it('does not show the property details or work order history', () => {
      render(<PropertyView propertyReference="00012345" />)

      expect(screen.queryByText(PROPERTY_HEADING)).not.toBeInTheDocument()
      expect(screen.queryByText(DETAILS_SPINNER)).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('work-orders-history')
      ).not.toBeInTheDocument()
    })
  })

  it('shows the under warranty flag when the property is under warranty', () => {
    mockHooks({
      propertyTenure: { property: { ...property, isUnderWarranty: true } },
    })

    render(<PropertyView propertyReference="00012345" />)

    expect(
      screen.getByText('This property is under warranty')
    ).toBeInTheDocument()
  })

  describe('legal disrepair', () => {
    it('shows the legal disrepair flag when the property is in legal disrepair', () => {
      mockHooks({ legalDisrepair: { isInLegalDisrepair: true } })

      render(<PropertyView propertyReference="00012345" />)

      expect(
        screen.getByText('This property is currently under legal disrepair')
      ).toBeInTheDocument()
    })

    it('shows the error above the work order history, alongside the property details, when the request fails', () => {
      mockHooks({
        legalDisrepair: {
          isInLegalDisrepair: null,
          error: 'Could not get legal disrepair status',
        },
      })

      render(<PropertyView propertyReference="00012345" />)

      const error = screen.getByText('Could not get legal disrepair status')
      const history = screen.getByTestId('work-orders-history')

      expect(screen.getByText(PROPERTY_HEADING)).toBeInTheDocument()
      expect(
        error.compareDocumentPosition(history) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    })
  })
})
