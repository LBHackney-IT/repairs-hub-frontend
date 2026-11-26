import { useState } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import UserContext from '../UserContext'
import WorkOrdersView from './WorkOrdersView'
import { contractManager } from 'factories/contract_manager'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { queryClient } from '@/utils/queryClient'
import filterOptions from '../../../cypress/fixtures/filter/workOrder.json'

jest.mock('@/utils/frontEndApiClient/requests')

const DEFAULT_FILTERS_KEY = 'RH - default work order filters'

type Query = Record<string, string | string[]>

// Next gives the page the URL's query as strings: a value that appears once is
// a string and one that appears several times is an array. Round-tripping
// through a query string reproduces that.
const toUrlQuery = (query: Record<string, unknown>): Query => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) =>
    [value].flat().forEach((v) => params.append(key, String(v)))
  )

  const urlQuery: Query = {}

  params.forEach((value, key) => {
    const existing = urlQuery[key]

    urlQuery[key] = existing === undefined ? value : [existing, value].flat()
  })

  return urlQuery
}

const workOrdersPage = (pageNumber: number, count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    reference: pageNumber * 1000 + i,
    dateRaised: '2021-01-12T16:24:26.632Z',
    priority: '2 [E] EMERGENCY',
    property: `${i} Pitcairn House`,
    status: 'In Progress',
    tradeDescription: 'Electrical - EL',
    description: `Work order ${pageNumber * 1000 + i}`,
  }))

type Respond = (params: Record<string, any>) => unknown

const apiRequest = frontEndApiRequest as jest.Mock

// Routes the mocked API by path and keeps a record of the work order requests
const mockApi = ({
  workOrders = (params) => workOrdersPage(params.PageNumber),
  filters = () => filterOptions,
}: { workOrders?: Respond; filters?: Respond } = {}) => {
  apiRequest.mockImplementation(async ({ path, params }) =>
    path === '/api/filter/WorkOrder' ? filters(params) : workOrders(params)
  )
}

const workOrdersCalls = () =>
  apiRequest.mock.calls
    .map(([request]) => request)
    .filter((request) => request.path === '/api/workOrders/')

const filterCalls = () =>
  apiRequest.mock.calls
    .map(([request]) => request)
    .filter((request) => request.path === '/api/filter/WorkOrder')

const lastWorkOrdersParams = () => workOrdersCalls().at(-1).params

// The URL the fake router has been pushed to, in the form the page receives it
let urlQuery: Query
let setUrlQuery: (query: Query) => void

const Page = ({ initialQuery }: { initialQuery: Query }) => {
  const [query, setQuery] = useState(initialQuery)

  urlQuery = query
  setUrlQuery = setQuery

  return (
    <UserContext.Provider value={{ user: contractManager }}>
      <WorkOrdersView query={query} />
    </UserContext.Provider>
  )
}

const renderView = (initialQuery: Query = {}) => {
  ;(useRouter as jest.Mock).mockReturnValue({
    pathname: '/',
    push: ({ query }) => setUrlQuery(toUrlQuery(query)),
  })

  return render(<Page initialQuery={initialQuery} />)
}

// As if the user used the browser's back button
const changeUrl = (query: Query) => act(() => setUrlQuery(query))

const waitForTable = () => screen.findByRole('table')

const isChecked = (testId: string) =>
  (screen.getByTestId(testId) as HTMLInputElement).checked

const tick = (testId: string) => fireEvent.click(screen.getByTestId(testId))

const apply = () => fireEvent.click(screen.getByTestId('apply-filters'))

const removeTag = (text: string) =>
  fireEvent.click(screen.getByRole('button', { name: `Remove ${text} filter` }))

describe('WorkOrdersView component', () => {
  beforeEach(() => {
    apiRequest.mockReset()
    queryClient.clear()
    localStorage.clear()
    mockApi()
  })

  describe('loading the list', () => {
    it('shows the heading and a spinner while the work orders load, then the table', async () => {
      let finishRequest: (workOrders: unknown) => void
      mockApi({
        workOrders: () =>
          new Promise((resolve) => {
            finishRequest = resolve
          }),
      })

      renderView()

      expect(
        await screen.findByRole('heading', { name: 'Manage work orders' })
      ).toBeInTheDocument()
      expect(await screen.findByText('Fetching work orders')).toBeVisible()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()

      await act(async () => finishRequest(workOrdersPage(1)))

      expect(await waitForTable()).toBeInTheDocument()
      expect(screen.queryByText('Fetching work orders')).not.toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Manage work orders' })
      ).toBeInTheDocument()
    })

    it('shows the work orders returned', async () => {
      renderView()

      await waitForTable()

      expect(screen.getByRole('link', { name: '1000' })).toHaveAttribute(
        'href',
        '/work-orders/1000'
      )
      expect(screen.getByRole('link', { name: '1009' })).toBeInTheDocument()
    })

    it('asks for the first page of 10 with no filters, excluding historical work orders', async () => {
      renderView()

      await waitForTable()

      expect(workOrdersCalls()).toHaveLength(1)
      expect(lastWorkOrdersParams()).toEqual({
        PageSize: 10,
        PageNumber: 1,
        IncludeHistorical: false,
      })
    })

    it('requests the filter options once', async () => {
      renderView()

      await waitForTable()
      await screen.findByTestId('StatusCode.80')

      expect(filterCalls()).toHaveLength(1)
    })
  })

  describe('filters in the URL', () => {
    it('requests the work orders with the filters', async () => {
      renderView({ StatusCode: ['80', '90'], Priorities: '2' })

      await waitForTable()

      expect(lastWorkOrdersParams()).toEqual({
        PageSize: 10,
        PageNumber: 1,
        StatusCode: ['80', '90'],
        Priorities: '2',
        IncludeHistorical: false,
      })
    })

    it('requests the work orders with each type of filter', async () => {
      renderView({
        StatusCode: '80',
        Priorities: '1',
        TradeCodes: 'AD',
        ContractorReference: 'PUR',
      })

      await waitForTable()

      expect(lastWorkOrdersParams()).toMatchObject({
        StatusCode: '80',
        Priorities: '1',
        TradeCodes: 'AD',
        ContractorReference: 'PUR',
      })
    })

    it('ticks the boxes for the filters and shows them as selected', async () => {
      renderView({ StatusCode: ['80', '90'], Priorities: '2' })

      await screen.findByTestId('StatusCode.80')

      expect(isChecked('StatusCode.80')).toBe(true)
      expect(isChecked('StatusCode.90')).toBe(true)
      expect(isChecked('Priorities.2')).toBe(true)
      expect(isChecked('StatusCode.50')).toBe(false)
      expect(isChecked('Priorities.1')).toBe(false)

      expect(
        screen.getByRole('button', { name: 'Remove In Progress filter' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: 'Remove Variation Pending Approval filter',
        })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Remove Emergency filter' })
      ).toBeInTheDocument()
    })

    it('uses the page number in the URL', async () => {
      renderView({ pageNumber: '3', StatusCode: '80' })

      await waitForTable()

      expect(lastWorkOrdersParams().PageNumber).toBe(3)
    })
  })

  describe('saved default filters', () => {
    beforeEach(() => {
      localStorage.setItem(
        DEFAULT_FILTERS_KEY,
        JSON.stringify({ StatusCode: ['80'] })
      )
    })

    it('are used when the URL has no query', async () => {
      renderView({})

      await screen.findByTestId('StatusCode.80')

      expect(lastWorkOrdersParams()).toMatchObject({ StatusCode: ['80'] })
      expect(isChecked('StatusCode.80')).toBe(true)
      expect(
        screen.getByRole('button', { name: 'Remove In Progress filter' })
      ).toBeInTheDocument()
    })

    it('are not used when the URL has a query, even one with only a page number', async () => {
      renderView({ pageNumber: '2' })

      await screen.findByTestId('StatusCode.80')

      expect(lastWorkOrdersParams()).toEqual({
        PageSize: 10,
        PageNumber: 2,
        IncludeHistorical: false,
      })
      expect(isChecked('StatusCode.80')).toBe(false)
    })
  })

  describe('applying filters', () => {
    it('puts the filters in the URL, requests the work orders with them and shows them as selected', async () => {
      renderView()
      await screen.findByTestId('StatusCode.80')

      tick('StatusCode.80')
      apply()

      await waitFor(() =>
        expect(urlQuery).toEqual({ pageNumber: '1', StatusCode: '80' })
      )
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toMatchObject({ StatusCode: '80' })
      )
      expect(
        await screen.findByRole('button', { name: 'Remove In Progress filter' })
      ).toBeInTheDocument()
    })

    it('sends filters from several categories', async () => {
      renderView()
      await screen.findByTestId('StatusCode.80')

      tick('StatusCode.80')
      tick('StatusCode.90')
      tick('Priorities.1')
      tick('TradeCodes.AD')
      tick('ContractorReference.PUR')
      apply()

      await waitFor(() =>
        expect(urlQuery).toEqual({
          pageNumber: '1',
          StatusCode: ['80', '90'],
          Priorities: '1',
          TradeCodes: 'AD',
          ContractorReference: 'PUR',
        })
      )
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toMatchObject({
          StatusCode: ['80', '90'],
          Priorities: '1',
          TradeCodes: 'AD',
          ContractorReference: 'PUR',
        })
      )
    })

    it('goes back to the first page', async () => {
      renderView({ pageNumber: '3', StatusCode: '80' })
      await screen.findByTestId('StatusCode.80')

      tick('Priorities.1')
      apply()

      await waitFor(() =>
        expect(urlQuery).toEqual({
          pageNumber: '1',
          StatusCode: '80',
          Priorities: '1',
        })
      )
      await waitFor(() => expect(lastWorkOrdersParams().PageNumber).toBe(1))
    })

    it('removes the filters when every box has been unticked', async () => {
      renderView({ StatusCode: '80' })
      await screen.findByTestId('StatusCode.80')

      tick('StatusCode.80')
      apply()

      await waitFor(() => expect(urlQuery).toEqual({ pageNumber: '1' }))
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toEqual({
          PageSize: 10,
          PageNumber: 1,
          IncludeHistorical: false,
        })
      )
      expect(
        await screen.findByText('You have no selected filters')
      ).toBeInTheDocument()
    })
  })

  describe('clearing filters', () => {
    it('removes every filter, unticks the boxes and requests the work orders without them', async () => {
      renderView({ StatusCode: ['80', '90'], Priorities: '2' })
      await screen.findByTestId('StatusCode.80')

      fireEvent.click(screen.getByText('Clear filters'))

      await waitFor(() => expect(urlQuery).toEqual({ pageNumber: '1' }))
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toEqual({
          PageSize: 10,
          PageNumber: 1,
          IncludeHistorical: false,
        })
      )
      expect(isChecked('StatusCode.80')).toBe(false)
      expect(isChecked('StatusCode.90')).toBe(false)
      expect(isChecked('Priorities.2')).toBe(false)
      expect(
        await screen.findByText('You have no selected filters')
      ).toBeInTheDocument()
    })
  })

  describe('removing a selected filter', () => {
    it('removes only that filter and requests the work orders without it', async () => {
      renderView({ StatusCode: ['80', '90'], Priorities: '2' })
      await screen.findByTestId('StatusCode.80')

      removeTag('In Progress')

      await waitFor(() =>
        expect(urlQuery).toEqual({
          pageNumber: '1',
          StatusCode: '90',
          Priorities: '2',
        })
      )
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toMatchObject({
          StatusCode: '90',
          Priorities: '2',
        })
      )
      expect(
        screen.queryByRole('button', { name: 'Remove In Progress filter' })
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: 'Remove Variation Pending Approval filter',
        })
      ).toBeInTheDocument()
    })

    it('removes the category when its last filter is removed', async () => {
      renderView({ StatusCode: '80', Priorities: '2' })
      await screen.findByTestId('StatusCode.80')

      removeTag('In Progress')

      await waitFor(() =>
        expect(urlQuery).toEqual({ pageNumber: '1', Priorities: '2' })
      )
      await waitFor(() =>
        expect(lastWorkOrdersParams().StatusCode).toBeUndefined()
      )
      expect(
        screen.queryByRole('heading', { name: 'Status' })
      ).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Priority' })).toBeVisible()
    })
  })

  describe('paging', () => {
    it('Next page goes to the next page and keeps the filters', async () => {
      renderView({ StatusCode: '80' })
      await waitForTable()

      fireEvent.click(screen.getByRole('button', { name: 'Next page' }))

      await waitFor(() =>
        expect(urlQuery).toEqual({ pageNumber: '2', StatusCode: '80' })
      )
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toMatchObject({
          PageNumber: 2,
          StatusCode: '80',
        })
      )
      expect(await screen.findByRole('link', { name: '2000' })).toBeVisible()
    })

    it('Previous page goes back to the previous page and keeps the filters', async () => {
      renderView({ pageNumber: '2', StatusCode: '80' })
      await waitForTable()

      fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))

      await waitFor(() =>
        expect(urlQuery).toEqual({ pageNumber: '1', StatusCode: '80' })
      )
      await waitFor(() =>
        expect(lastWorkOrdersParams()).toMatchObject({
          PageNumber: 1,
          StatusCode: '80',
        })
      )
      expect(await screen.findByRole('link', { name: '1000' })).toBeVisible()
    })

    it('has no Next page when fewer than a full page of work orders is returned', async () => {
      mockApi({ workOrders: (params) => workOrdersPage(params.PageNumber, 9) })

      renderView()
      await waitForTable()

      expect(
        screen.queryByRole('button', { name: 'Next page' })
      ).not.toBeInTheDocument()
    })
  })

  describe('when the URL changes', () => {
    it('requests the work orders again with the new query', async () => {
      renderView()
      await waitForTable()

      changeUrl({ pageNumber: '2', Priorities: '1' })

      await waitFor(() => expect(workOrdersCalls()).toHaveLength(2))
      expect(lastWorkOrdersParams()).toMatchObject({
        PageNumber: 2,
        Priorities: '1',
      })
      expect(await screen.findByRole('link', { name: '2000' })).toBeVisible()
    })

    it('keeps the filter panel, without requesting the filter options again', async () => {
      renderView()
      const statusBox = await screen.findByTestId('StatusCode.80')
      await waitForTable()

      changeUrl({ pageNumber: '2' })

      await waitFor(() => expect(workOrdersCalls()).toHaveLength(2))
      expect(screen.getByTestId('StatusCode.80')).toBe(statusBox)
      expect(filterCalls()).toHaveLength(1)
    })

    it('keeps the filter panel while the work orders load', async () => {
      renderView()
      await waitForTable()

      mockApi({ workOrders: () => new Promise(() => {}) })
      changeUrl({ pageNumber: '2' })

      expect(await screen.findByText('Fetching work orders')).toBeVisible()
      expect(screen.getByTestId('StatusCode.80')).toBeVisible()
    })
  })

  describe('when a request fails', () => {
    let consoleError: jest.SpyInstance

    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleError.mockRestore()
    })

    it('shows an error instead of the table when the work orders fail to load', async () => {
      mockApi({
        workOrders: () => {
          throw { response: { status: 500, data: { message: 'Broken' } } }
        },
      })

      renderView()

      expect(
        await screen.findByText(/an error occurred with error status: 500/)
      ).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('shows an error and no filter options when the filter options fail to load', async () => {
      mockApi({
        filters: () => {
          throw { response: { status: 500, data: { message: 'Broken' } } }
        },
      })

      renderView()

      expect(
        await screen.findByText(/an error occurred with error status: 500/)
      ).toBeInTheDocument()
      await waitForTable()
      expect(screen.queryByTestId('StatusCode.80')).not.toBeInTheDocument()
    })
  })

  describe('default filter preset', () => {
    let confirm: jest.SpyInstance

    beforeEach(() => {
      confirm = jest.spyOn(window, 'confirm')
    })

    afterEach(() => {
      confirm.mockRestore()
    })

    const savePreset = () =>
      fireEvent.click(
        screen.getByText('Save selected filters as my default preset')
      )

    const removePreset = () =>
      fireEvent.click(screen.getByText('Remove saved default filter preset'))

    it('is saved once the user confirms', async () => {
      confirm.mockReturnValue(true)
      renderView({ StatusCode: ['80', '90'], Priorities: '2' })
      await screen.findByTestId('StatusCode.80')

      savePreset()

      expect(JSON.parse(localStorage.getItem(DEFAULT_FILTERS_KEY))).toEqual({
        StatusCode: ['80', '90'],
        Priorities: ['2'],
      })
    })

    it('lists the selected filters when asking for confirmation', async () => {
      confirm.mockReturnValue(false)
      renderView({ StatusCode: '80', Priorities: '2' })
      await screen.findByTestId('StatusCode.80')

      savePreset()

      expect(confirm).toHaveBeenCalledWith(
        expect.stringContaining('In Progress')
      )
      expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Emergency'))
    })

    it('is not saved when the user declines', async () => {
      confirm.mockReturnValue(false)
      renderView({ StatusCode: '80' })
      await screen.findByTestId('StatusCode.80')

      savePreset()

      expect(localStorage.getItem(DEFAULT_FILTERS_KEY)).toBeNull()
    })

    it('is removed once the user confirms', async () => {
      confirm.mockReturnValue(true)
      localStorage.setItem(
        DEFAULT_FILTERS_KEY,
        JSON.stringify({ StatusCode: ['80'] })
      )
      renderView({ pageNumber: '1' })
      await screen.findByTestId('StatusCode.80')

      removePreset()

      expect(localStorage.getItem(DEFAULT_FILTERS_KEY)).toBeNull()
    })

    it('is kept when the user declines to remove it', async () => {
      confirm.mockReturnValue(false)
      localStorage.setItem(
        DEFAULT_FILTERS_KEY,
        JSON.stringify({ StatusCode: ['80'] })
      )
      renderView({ pageNumber: '1' })
      await screen.findByTestId('StatusCode.80')

      removePreset()

      expect(localStorage.getItem(DEFAULT_FILTERS_KEY)).not.toBeNull()
    })
  })
})
