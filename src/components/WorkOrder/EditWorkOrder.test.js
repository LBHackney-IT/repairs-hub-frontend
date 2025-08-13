import { render, waitFor } from '@testing-library/react'
import EditWorkOrder from './EditWorkOrder'
import { getWorkOrderDetails } from '@/utils/requests/workOrders'
import { getContactDetails, getPropertyData } from '@/utils/requests/property'

jest.mock('@/utils/requests/workOrders', () => ({
  getWorkOrderDetails: jest.fn(),
}))
jest.mock('@/utils/requests/property', () => ({
  getPropertyData: jest.fn(),
  getContactDetails: jest.fn(),
}))

const mockWorkOrder = {
  reference: 10000040,
  description: 'Fix the leaking pipe',
}
const mockPropertyData = {
  property: {
    propertyReference: '00023402',
    address: {
      shortAddress: '1 House',
      postalCode: 'EE 123',
      addressLine: '1 House',
      streetSuffix: null,
    },
    hierarchyType: {
      levelCode: null,
      subTypeCode: null,
      subTypeDescription: 'Dwelling',
    },
    tmoName: 'London Borough of Hackney',
    canRaiseRepair: true,
    boilerHouseId: '',
  },
  tenure: {
    typeCode: 'SEC',
    typeDescription: 'Secure',
    tenancyAgreementReference: '0116172/01',
    id: '96d45a3e-d892-2ae3-8b7c-65acb9269c74',
  },
}

const mockContactDetails = [
  {
    fullName: 'FAKE_Deborah FAKE_Kirby',
    tenureType: 'Tenant',
    personId: '6cf60708-b5ff-777f-63a2-39fe4e9493c4',
    phoneNumbers: [
      {
        contactType: 'phone',
        value: '12345678912',
        description: null,
        subType: 'mainNumber',
        contactId: '7bf8bf36-e923-491c-b7e4-c77a9d204803',
      },
      {
        contactType: 'phone',
        value: '12345678912',
        description: null,
        subType: 'socialWorker',
        contactId: '3a3009b8-0e86-48de-8316-200f25d95f25',
      },
    ],
  },
]
describe('EditWorkOrder Component', () => {
  beforeEach(() => {
    getWorkOrderDetails.mockResolvedValue({
      response: mockWorkOrder,
      success: true,
      error: null,
    })
    getPropertyData.mockResolvedValue({
      response: mockPropertyData,
      success: true,
      error: null,
    })
    getContactDetails.mockResolvedValue({
      response: mockContactDetails,
      success: true,
      error: null,
    })
  })

  it('should render correctly after fetching work order', async () => {
    const { asFragment, getByText } = render(
      <EditWorkOrder workOrderReference={mockWorkOrder.reference} />
    )

    // Wait for the async fetch to complete and the form to render
    await waitFor(() =>
      expect(getByText('Edit work order: 10000040')).toBeInTheDocument()
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
