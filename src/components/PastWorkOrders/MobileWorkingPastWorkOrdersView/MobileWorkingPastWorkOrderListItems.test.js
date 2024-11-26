import React from 'react'
import { WorkOrder } from '../../../models/workOrder'
import { operative } from 'factories/operative'
import { render, screen } from '@testing-library/react'
import { MobileWorkingPastWorkOrderListItems } from './MobileWorkingPastWorkOrderListItems'

const mockWorkOrders = [
  {
    appointment: {
      date: '2024-11-20',
      description: 'Externally Managed Appointment',
      start: '08:00',
      end: '16:15',
      reason: 'FIRST',
      note: null,
      assignedStart: '11:05',
      assignedEnd: '13:01',
      startedAt: '11:05',
    },
    reference: 1,
    dateRaised: '2024-11-18T11:48:21.276019Z',
    lastUpdated: null,
    priority: '[E] EMERGENCY',
    priorityCode: null,
    property: '1 Hackney',
    propertyPostCode: 'N16',
    owner: 'HH General Building Repair',
    description: 'Work order 1',
    propertyReference: '00030674',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'Completed',
    drsSyncStatus: null,
    timeOrderSentToDrs: null,
  },
  {
    appointment: {
      date: '2024-11-20',
      description: 'Externally Managed Appointment',
      start: '08:00',
      end: '16:15',
      reason: 'FIRST',
      note: null,
      assignedStart: '11:05',
      assignedEnd: '13:01',
      startedAt: '11:05',
    },
    reference: 2,
    dateRaised: '2024-11-18T11:48:21.276019Z',
    lastUpdated: null,
    priority: '[E] EMERGENCY',
    priorityCode: null,
    property: '1 Hackney',
    propertyPostCode: 'N16',
    owner: 'HH General Building Repair',
    description: 'Work order 2',
    propertyReference: '00030674',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'Completed',
    drsSyncStatus: null,
    timeOrderSentToDrs: null,
  },
]

describe('MobileWorkingPastWorkOrderListItems Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should match snapshot when there are work orders', () => {
    const { asFragment } = render(
      <MobileWorkingPastWorkOrderListItems
        currentUser={operative}
        workOrders={mockWorkOrders.map((wo) => new WorkOrder(wo))}
      />
    )
    expect(screen.getByText('Work order 1'))
    expect(screen.getByText('Work order 2'))
    expect(asFragment()).toMatchSnapshot()
  })

  it('should be empty when there are no orders', () => {
    const { asFragment } = render(
      <MobileWorkingPastWorkOrderListItems
        currentUser={operative}
        workOrders={[]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
