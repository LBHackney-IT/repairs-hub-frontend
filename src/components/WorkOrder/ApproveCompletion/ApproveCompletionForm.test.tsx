import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApproveCompletionForm from './ApproveCompletionForm'
import { approveWorkOrderCompletionRequest } from '@/requests/workOrders'
import { APIResponseError } from '@/root/src/types/requests/types'

jest.mock('@/requests/workOrders')

const approveCompletion = approveWorkOrderCompletionRequest as jest.Mock

const REFERENCE = '10000040'

const renderForm = (onApproved = jest.fn()) => {
  render(
    <ApproveCompletionForm
      workOrderReference={REFERENCE}
      onApproved={onApproved}
    />
  )
  return { onApproved }
}

const clickApprove = () =>
  userEvent.click(screen.getByRole('button', { name: 'Approve completion' }))

describe('ApproveCompletionForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('shows the error when approving fails', async () => {
    approveCompletion.mockResolvedValue({
      success: false,
      response: null,
      error: new APIResponseError('Could not approve'),
    })

    renderForm()
    await clickApprove()

    expect(await screen.findByText('Could not approve')).toBeInTheDocument()
  })

  it('shows a spinner while approving', async () => {
    approveCompletion.mockReturnValue(new Promise(() => {}))

    renderForm()
    await clickApprove()

    expect(await screen.findByTestId('spinner-undefined')).toBeInTheDocument()
  })

  it('sends the approve request when submitted', async () => {
    approveCompletion.mockResolvedValue({
      success: true,
      response: {},
      error: null,
    })

    const { onApproved } = renderForm()
    await clickApprove()

    expect(approveCompletion).toHaveBeenCalledWith(REFERENCE, '')
    expect(onApproved).toHaveBeenCalledTimes(1)
  })

  it('sends the note with the approve request when one is added', async () => {
    approveCompletion.mockResolvedValue({
      success: true,
      response: {},
      error: null,
    })

    renderForm()
    await userEvent.type(
      screen.getByLabelText('Add notes (optional)'),
      'Checked on site'
    )
    await clickApprove()

    expect(approveCompletion).toHaveBeenCalledWith(REFERENCE, 'Checked on site')
  })
})
