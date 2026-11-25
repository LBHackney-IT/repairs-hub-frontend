import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApproveCompletionView from './ApproveCompletionView'
import {
  approveWorkOrderCompletionRequest,
  getWorkOrderDetailsRequest,
} from '@/requests/workOrders'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError } from '@/root/src/types/requests/types'

jest.mock('next/router', () => ({ back: jest.fn() }))
jest.mock('@/requests/workOrders')

const getWorkOrderDetails = getWorkOrderDetailsRequest as jest.Mock
const approveCompletion = approveWorkOrderCompletionRequest as jest.Mock

const REFERENCE = '10000040'

const mockWorkOrderWithStatus = (status: string) =>
  getWorkOrderDetails.mockResolvedValue({
    success: true,
    response: new WorkOrder({ reference: REFERENCE, status }),
    error: null,
  })

const renderView = () =>
  render(<ApproveCompletionView workOrderReference={REFERENCE} />)

describe('ApproveCompletionView', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('shows a spinner while loading', () => {
    getWorkOrderDetails.mockReturnValue(new Promise(() => {}))

    renderView()

    expect(screen.getByTestId('spinner-undefined')).toBeInTheDocument()
  })

  it('shows the error when the work order cannot be found', async () => {
    getWorkOrderDetails.mockResolvedValue({
      success: false,
      response: null,
      error: new APIResponseError('Could not find a work order'),
    })

    renderView()

    expect(
      await screen.findByText('Could not find a work order')
    ).toBeInTheDocument()
  })

  it('shows a notice when the work order is already approved', async () => {
    mockWorkOrderWithStatus('Completed')

    renderView()

    expect(await screen.findByText('Nothing to approve')).toBeInTheDocument()
  })

  it('shows the success page when the form is submitted', async () => {
    mockWorkOrderWithStatus('Completion Pending Approval')
    approveCompletion.mockResolvedValue({
      success: true,
      response: null,
      error: null,
    })

    renderView()

    await userEvent.click(
      await screen.findByRole('button', { name: 'Approve completion' })
    )

    expect(
      await screen.findByText('Work order completion approved')
    ).toBeInTheDocument()
  })
})
