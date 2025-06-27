import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const TestErrorMessage = 'Test submission error'

jest.mock('@/root/src/utils/requests/trades', () => ({
  getTrades: jest.fn(() =>
    Promise.resolve({
      success: true,
      response: [
        { key: 'PL', name: 'Plumbing', description: 'Plumbing' },
        { key: 'OT', name: 'followon-trades-other', description: 'Other' },
      ],
    })
  ),
}))
jest.mock('@/root/src/utils/frontEndApiClient/requests', () => ({
  fetchSimpleFeatureToggles: jest.fn(() =>
    Promise.resolve({
      enableFollowOnIsEmergencyField: true,
    })
  ),
}))
jest.mock('../WorkOrder/Photos/hooks/validateFileUpload', () => ({
  __esModule: true,
  default: jest.fn(() => null), // Always pass validation
}))

describe('MobileWorkingCloseWorkOrderForm component', () => {
  it('should render properly', async () => {
    const { asFragment } = render(
      <MobileWorkingCloseWorkOrderForm
        workOrderReference="10001234"
        onSubmit={jest.fn()}
        isLoading={false}
        presetValues={{}}
      />
    )

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('retains "No access" and "Final report" fields after a submission error', async () => {
    const onSubmitMock = jest.fn().mockImplementationOnce(() => {
      throw new Error(TestErrorMessage)
    })
    render(
      <MobileWorkingCloseWorkOrderForm
        workOrderReference="10001234"
        onSubmit={onSubmitMock}
        isLoading={false}
      />
    )
    userEvent.click(await screen.findByLabelText('No access'))
    userEvent.type(screen.getByLabelText('Final report'), 'Test final report')
    userEvent.click(await screen.findByRole('form'))

    expect(screen.getByLabelText('No access')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toBeInTheDocument()
    expect(screen.getByLabelText('Final report')).toHaveValue(
      'Test final report'
    )
  })
})
