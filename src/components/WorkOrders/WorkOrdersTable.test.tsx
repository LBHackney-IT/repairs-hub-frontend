import { render, screen, fireEvent, within } from '@testing-library/react'
import WorkOrdersTable from './WorkOrdersTable'
import type { WorkOrderListItem } from './WorkOrderRow'

const workOrder = (
  overrides: Partial<WorkOrderListItem> = {}
): WorkOrderListItem => ({
  reference: 10000012,
  dateRaised: '2021-01-12T16:24:26.632Z',
  priority: '2 [E] EMERGENCY',
  property: '1 Pitcairn House St Thomass Square',
  status: 'In Progress',
  tradeDescription: 'Electrical - EL',
  description: 'Door entry; Residents locked out',
  ...overrides,
})

const workOrders = (count: number) =>
  Array.from({ length: count }, (_, i) => workOrder({ reference: 100 + i }))

const renderTable = ({
  rows = [workOrder()],
  pageNumber = 1,
  pageSize = 10,
  handlePageClick = jest.fn(),
}: {
  rows?: WorkOrderListItem[]
  pageNumber?: number
  pageSize?: number
  handlePageClick?: jest.Mock
} = {}) => {
  render(
    <WorkOrdersTable
      workOrders={rows}
      pageNumber={pageNumber}
      pageSize={pageSize}
      handlePageClick={handlePageClick}
    />
  )

  return { handlePageClick }
}

describe('WorkOrdersTable component', () => {
  describe('table', () => {
    it('has a column for each of the details of a work order', () => {
      renderTable()

      expect(
        screen
          .getAllByRole('columnheader')
          .map((heading) => heading.textContent)
      ).toEqual([
        'Reference',
        'Date raised',
        'Priority',
        'Property',
        'Status',
        'Trade',
        'Description',
      ])
    })

    it('has a row for each work order', () => {
      renderTable({ rows: workOrders(3) })

      // The heading row, then a row for each work order
      expect(screen.getAllByRole('row')).toHaveLength(4)
    })

    it('shows the details of a work order', () => {
      renderTable()

      const row = screen.getAllByRole('row')[1]

      expect(
        within(row).getByRole('link', { name: '10000012' })
      ).toHaveAttribute('href', '/work-orders/10000012')
      expect(within(row).getByText(/12 Jan 2021/)).toBeInTheDocument()
      expect(within(row).getByText('2 [E] EMERGENCY')).toBeInTheDocument()
      expect(
        within(row).getByText('1 Pitcairn House St Thomass Square')
      ).toBeInTheDocument()
      expect(within(row).getByText('In progress')).toBeInTheDocument()
      expect(within(row).getByText('Electrical - EL')).toBeInTheDocument()
      expect(
        within(row).getByText('Door entry; Residents locked out')
      ).toBeInTheDocument()
    })

    it('shows a dash when a work order has no date raised', () => {
      renderTable({ rows: [workOrder({ dateRaised: null })] })

      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('has no rows below the headings when there are no work orders', () => {
      renderTable({ rows: [] })

      expect(screen.getAllByRole('row')).toHaveLength(1)
    })
  })

  describe('Previous page button', () => {
    it('is not shown on the first page', () => {
      renderTable({ pageNumber: 1 })

      expect(
        screen.queryByRole('button', { name: 'Previous page' })
      ).not.toBeInTheDocument()
    })

    it.each([2, 5])('is shown on page %i', (pageNumber) => {
      renderTable({ pageNumber })

      expect(
        screen.getByRole('button', { name: 'Previous page' })
      ).toBeInTheDocument()
    })

    it('asks for the page before the current one when clicked', () => {
      const { handlePageClick } = renderTable({ pageNumber: 3 })

      fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))

      expect(handlePageClick).toHaveBeenCalledTimes(1)
      expect(handlePageClick).toHaveBeenCalledWith(2)
    })
  })

  describe('Next page button', () => {
    it.each([
      ['as many work orders as the page size', 10, 10],
      ['more work orders than the page size', 11, 10],
      ['as many work orders as a smaller page size', 2, 2],
    ])('is shown with %s', (_, count, pageSize) => {
      renderTable({ rows: workOrders(count), pageSize })

      expect(
        screen.getByRole('button', { name: 'Next page' })
      ).toBeInTheDocument()
    })

    it.each([
      ['fewer work orders than the page size', 9, 10],
      ['no work orders', 0, 10],
    ])('is not shown with %s', (_, count, pageSize) => {
      renderTable({ rows: workOrders(count), pageSize })

      expect(
        screen.queryByRole('button', { name: 'Next page' })
      ).not.toBeInTheDocument()
    })

    it('asks for the page after the current one when clicked', () => {
      const { handlePageClick } = renderTable({
        rows: workOrders(10),
        pageNumber: 3,
      })

      fireEvent.click(screen.getByRole('button', { name: 'Next page' }))

      expect(handlePageClick).toHaveBeenCalledTimes(1)
      expect(handlePageClick).toHaveBeenCalledWith(4)
    })
  })

  it('shows both buttons in the middle of a long list', () => {
    renderTable({ rows: workOrders(10), pageNumber: 2 })

    expect(
      screen.getByRole('button', { name: 'Previous page' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next page' })
    ).toBeInTheDocument()
  })
})
