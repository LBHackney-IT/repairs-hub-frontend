import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import UserContext from '../../UserContext'
import WorkOrdersHistoryTable from './WorkOrdersHistoryTable'
import { agent } from 'factories/agent'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import {
  fetchWorkOrderFiltersRequest,
  fetchWorkOrdersRequest,
} from '@/requests/workOrders'

jest.mock('@/requests/workOrders')

const mockFetchWorkOrderFilters = fetchWorkOrderFiltersRequest as jest.Mock
const mockFetchWorkOrders = fetchWorkOrdersRequest as jest.Mock

const trades = {
  Trades: [
    { key: 'DE', description: 'Door Entry Engineer' },
    { key: 'PL', description: 'Plumbing' },
    { key: 'EL', description: 'Electrical' },
  ],
}

describe('WorkOrdersHistoryTable component', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Leave the trades loading unless a test needs them, so the filter
    // dropdown isn't rendered
    mockFetchWorkOrderFilters.mockReturnValue(new Promise(() => {}))
  })

  const props = {
    tabName: 'Work orders history',
    propertyReference: '00012345',
    workOrders: [
      {
        reference: 10000012,
        dateRaised: new Date('2021-01-18T15:28:57.17811'),
        lastUpdated: null,
        priority: '1 [I] IMMEDIATE',
        property: '16 Pitcairn House  St Thomass Square',
        owner: '',
        tradeDescription: 'DOOR ENTRY ENGINEER - DE',
        description: 'This is an immediate repair description',
        propertyReference: '00012345',
        status: 'In progress',
      },
      {
        reference: 10000013,
        dateRaised: new Date('2021-01-23T16:28:57.17811'),
        lastUpdated: null,
        priority: '4 [U] URGENT',
        property: '16 Pitcairn House  St Thomass Square',
        owner: '',
        tradeDescription: 'DOOR ENTRY ENGINEER - DE',
        description: 'This is an urgent repair description',
        propertyReference: '00012345',
        status: 'In progress',
      },
    ],
  }

  describe('when logged in as an agent', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            propertyReference={props.propertyReference}
            hasMore={false}
            loadMore={() => {}}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contract manager', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManager }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            propertyReference={props.propertyReference}
            hasMore={false}
            loadMore={() => {}}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an authorisation manager', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: authorisationManager }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            propertyReference={props.propertyReference}
            hasMore={false}
            loadMore={() => {}}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  const renderTable = (
    overrides: Partial<ComponentProps<typeof WorkOrdersHistoryTable>> = {}
  ) =>
    render(
      <UserContext.Provider value={{ user: agent }}>
        <WorkOrdersHistoryTable
          workOrders={props.workOrders}
          tabName={props.tabName}
          propertyReference={props.propertyReference}
          hasMore={false}
          loadMore={jest.fn()}
          {...overrides}
        />
      </UserContext.Provider>
    )

  describe('load more', () => {
    it('shows a Load more button, which loads more work orders, when there are more', async () => {
      const loadMore = jest.fn()

      renderTable({ hasMore: true, loadMore })

      await userEvent.click(screen.getByRole('button', { name: 'Load more' }))

      expect(loadMore).toHaveBeenCalledTimes(1)
    })

    it('does not show a Load more button when there are no more', () => {
      renderTable({ hasMore: false })

      expect(
        screen.queryByRole('button', { name: 'Load more' })
      ).not.toBeInTheDocument()
    })
  })

  describe('filtering by trade', () => {
    const plumbingWorkOrder = {
      ...props.workOrders[0],
      reference: 10000025,
      tradeDescription: 'Plumbing',
      description: 'A plumbing repair',
    }

    beforeEach(() => {
      mockFetchWorkOrderFilters.mockResolvedValue(trades)
    })

    const selectTrade = async (trade: string) => {
      const picker = await screen.findByTestId('trade-picker')
      await userEvent.selectOptions(picker, trade)
    }

    it('lists the trades to filter by', async () => {
      renderTable()

      const options = await screen.findAllByTestId('trade-option')

      expect(options.map((option) => option.textContent)).toEqual([
        'Door Entry Engineer',
        'Plumbing',
        'Electrical',
      ])
    })

    it("requests all of the property's work orders for the selected trade", async () => {
      mockFetchWorkOrders.mockResolvedValue([plumbingWorkOrder])

      renderTable()
      await selectTrade('Plumbing')

      await waitFor(() =>
        expect(mockFetchWorkOrders).toHaveBeenCalledWith({
          propertyReference: '00012345',
          PageNumber: 1,
          sort: 'dateraised:desc',
          TradeCodes: 'PL',
          PageSize: 0,
        })
      )
    })

    it('shows only the work orders for the selected trade, without Load more', async () => {
      mockFetchWorkOrders.mockResolvedValue([plumbingWorkOrder])

      renderTable({ hasMore: true })
      await selectTrade('Plumbing')

      expect(await screen.findByText('A plumbing repair')).toBeInTheDocument()
      expect(
        screen.queryByText('This is an immediate repair description')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Load more' })
      ).not.toBeInTheDocument()
    })

    it('shows a message when there are no work orders for the selected trade', async () => {
      mockFetchWorkOrders.mockResolvedValue([])

      renderTable()
      await selectTrade('Electrical')

      expect(
        await screen.findByText(
          'There are no historical repairs with Electrical.'
        )
      ).toBeInTheDocument()
    })

    it('shows all of the work orders again when the filters are cleared', async () => {
      mockFetchWorkOrders.mockResolvedValue([plumbingWorkOrder])

      renderTable()
      await selectTrade('Plumbing')
      await screen.findByText('A plumbing repair')

      await userEvent.click(screen.getByText('Clear filters'))

      expect(
        screen.getByText('This is an immediate repair description')
      ).toBeInTheDocument()
      expect(screen.queryByText('A plumbing repair')).not.toBeInTheDocument()
    })
  })
})
