import React from 'react'
import { operative } from 'factories/operative'
import { render, screen } from '@testing-library/react'
import MobileWorkingPastWorkOrdersView from './MobileWorkingPastWorkOrdersView'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

jest.mock('@/utils/frontEndApiClient/requests')

const workOrders = [
  {
    reference: 10000012,
    dateRaised: '2021-01-12T16:24:26.632Z',
    lastUpdated: new Date('2021-01-13T16:24:26.632Z'),
    priority: '2 [E] EMERGENCY',
    property: '1 Pitcairn House St Thomass Square',
    owner: '',
    status: 'In Progress',
    tradeDescription: 'Electrical - EL',
    description: 'First work order description',
  },
  {
    reference: 10000012,
    dateRaised: '2021-01-12T16:24:26.632Z',
    lastUpdated: new Date('2021-01-13T16:24:26.632Z'),
    priority: '2 [E] EMERGENCY',
    property: '1 Pitcairn House St Thomass Square',
    owner: '',
    status: 'In Progress',
    tradeDescription: 'Electrical - EL',
    description: 'Second work order description',
  },
]

describe('MobileWorkingPastWorkOrdersView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should match snapshot when there are work orders', async () => {
    // Mock a dynamic API response with generated work orders
    const mockWorkOrders = workOrders
    frontEndApiRequest.mockResolvedValueOnce(mockWorkOrders)

    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={operative} />
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when there are no work orders', async () => {
    frontEndApiRequest.mockResolvedValueOnce([])

    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={operative} />
    )

    await screen.findByText('No work orders displayed')
    expect(screen.getByText('No work orders displayed')).toBeInTheDocument()
    expect(
      screen.getByText('Please contact your supervisor')
    ).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })
})
