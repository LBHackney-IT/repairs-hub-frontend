import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import UserContext from '../../UserContext'
import WorkOrdersFilterView from './WorkOrdersFilterView'
import { contractManager } from 'factories/contract_manager'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { queryClient } from '@/utils/queryClient'

jest.mock('@/utils/frontEndApiClient/requests')

const apiRequest = frontEndApiRequest as jest.Mock

const filters = {
  Priority: [{ key: '1', description: 'Immediate' }],
  Status: [
    { key: '80', description: 'In Progress' },
    { key: '50', description: 'Complete' },
  ],
  Trades: [{ key: 'EL', description: 'Electrical' }],
  Contractors: [
    { key: 'AVP', description: 'Avonline Network (A) Ltd' },
    { key: 'PUR', description: 'PURDY CONTRACTS (C2A)' },
  ],
}

describe('WorkOrdersFilterView component', () => {
  const props = {
    onFilterSubmit: jest.fn(),
    clearFilters: jest.fn(),
    onFilterRemove: jest.fn(),
  }

  const view = (appliedFilters = {}) => (
    <UserContext.Provider value={{ user: contractManager }}>
      <WorkOrdersFilterView {...props} appliedFilters={appliedFilters} />
    </UserContext.Provider>
  )

  const renderLoaded = async (appliedFilters = {}) => {
    apiRequest.mockResolvedValue(filters)

    const result = render(view(appliedFilters))
    await screen.findByTestId('StatusCode.80')

    return result
  }

  beforeEach(() => {
    apiRequest.mockReset()
    queryClient.clear()
  })

  describe('filter options', () => {
    it('requests them from the filter API', async () => {
      await renderLoaded()

      expect(apiRequest).toHaveBeenCalledTimes(1)
      expect(apiRequest).toHaveBeenCalledWith({
        method: 'get',
        path: '/api/filter/WorkOrder',
      })
    })

    it('shows a box for each option in every category', async () => {
      await renderLoaded()

      expect(screen.getByTestId('StatusCode.80')).toBeInTheDocument()
      expect(screen.getByTestId('StatusCode.50')).toBeInTheDocument()
      expect(screen.getByTestId('Priorities.1')).toBeInTheDocument()
      expect(screen.getByTestId('TradeCodes.EL')).toBeInTheDocument()
      expect(screen.getByTestId('ContractorReference.AVP')).toBeInTheDocument()
      expect(screen.getByTestId('ContractorReference.PUR')).toBeInTheDocument()
    })

    it('has none until the options have loaded', async () => {
      let respond: (options: unknown) => void
      apiRequest.mockReturnValue(
        new Promise((resolve) => {
          respond = resolve
        })
      )

      render(view())

      expect(screen.queryByTestId('StatusCode.80')).not.toBeInTheDocument()

      respond(filters)

      expect(await screen.findByTestId('StatusCode.80')).toBeInTheDocument()
    })

    it('does not request them again when the applied filters change', async () => {
      const { rerender } = await renderLoaded()

      rerender(view({ StatusCode: ['80'] }))

      expect(apiRequest).toHaveBeenCalledTimes(1)
    })

    it('shows an error and no filters when the request fails', async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      apiRequest.mockRejectedValue({ response: { status: 500 } })

      render(view())

      expect(
        await screen.findByText(/Oops an error occurred with error status: 500/)
      ).toBeInTheDocument()
      expect(screen.queryByText('Filters')).not.toBeInTheDocument()

      consoleError.mockRestore()
    })
  })

  describe('selected filters', () => {
    it('shows the applied filters as tags', async () => {
      await renderLoaded({ StatusCode: ['80'], Priorities: ['1'] })

      expect(
        screen.getByRole('button', { name: 'Remove In Progress filter' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Remove Immediate filter' })
      ).toBeInTheDocument()
    })

    it('says so when no filters are applied', async () => {
      await renderLoaded()

      expect(screen.getByText('You have no selected filters')).toBeVisible()
    })

    it('keeps the tags in step with the applied filters', async () => {
      const { rerender } = await renderLoaded()
      expect(screen.queryByLabelText('Remove In Progress filter')).toBeNull()

      rerender(view({ StatusCode: ['80'] }))

      expect(
        screen.getByLabelText('Remove In Progress filter')
      ).toBeInTheDocument()
    })

    it('tells the parent which filter to remove when a tag is removed', async () => {
      await renderLoaded({ StatusCode: ['80', '50'] })

      fireEvent.click(screen.getByLabelText('Remove Complete filter'))

      expect(props.onFilterRemove).toHaveBeenCalledTimes(1)
      expect(props.onFilterRemove).toHaveBeenCalledWith('Status', 1)
    })

    it('tells the parent when the filters are cleared', async () => {
      await renderLoaded({ StatusCode: ['80'] })

      fireEvent.click(screen.getByText('Clear filters'))

      expect(props.clearFilters).toHaveBeenCalledTimes(1)
    })
  })

  describe('applying filters', () => {
    const apply = () => fireEvent.click(screen.getByTestId('apply-filters'))

    it('passes the ticked options to the parent', async () => {
      await renderLoaded()

      fireEvent.click(screen.getByTestId('StatusCode.80'))
      fireEvent.click(screen.getByTestId('Priorities.1'))
      fireEvent.click(screen.getByTestId('TradeCodes.EL'))
      fireEvent.click(screen.getByTestId('ContractorReference.PUR'))
      apply()

      await waitFor(() => expect(props.onFilterSubmit).toHaveBeenCalledTimes(1))
      expect(props.onFilterSubmit).toHaveBeenCalledWith({
        StatusCode: { 80: true, 50: false },
        Priorities: { 1: true },
        TradeCodes: { EL: true },
        ContractorReference: { AVP: false, PUR: true },
      })
    })

    it('passes the options as unticked when nothing is ticked', async () => {
      await renderLoaded()

      apply()

      await waitFor(() => expect(props.onFilterSubmit).toHaveBeenCalledTimes(1))
      expect(props.onFilterSubmit).toHaveBeenCalledWith({
        StatusCode: { 80: false, 50: false },
        Priorities: { 1: false },
        TradeCodes: { EL: false },
        ContractorReference: { AVP: false, PUR: false },
      })
    })
  })
})
