import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const TestErrorMessage = 'Test submission error'

jest.mock('@/requests/trades', () => ({
  getTradeFiltersRequest: jest.fn(() =>
    Promise.resolve({
      success: true,
      response: [
        { key: 'PL', name: 'Plumbing', description: 'Plumbing' },
        { key: 'OT', name: 'followon-trades-other', description: 'Other' },
      ],
    })
  ),
}))
jest.mock('@/requests/featureToggles', () => ({
  fetchSimpleFeatureTogglesRequest: jest.fn(() =>
    Promise.resolve({
      enableFollowOnIsEmergencyField: true,
    })
  ),
}))
jest.mock('@/root/src/utils/frontEndApiClient/requests', () => ({
  frontEndApiRequest: jest.fn(() =>
    Promise.resolve({
      email: 'test@test.com',
      name: 'Test User',
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

    await act(async () =>
      userEvent.click(await screen.findByLabelText('No access'))
    )
    await act(() =>
      userEvent.type(screen.getByLabelText('Final report'), 'Test final report')
    )
    await act(async () => userEvent.click(await screen.findByRole('form')))

    expect(screen.getByLabelText('No access')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toBeInTheDocument()
    expect(screen.getByLabelText('Final report')).toHaveValue(
      'Test final report'
    )
  })
})

describe('MobileWorkingCloseWorkOrderForm component - completion approval notice', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  const renderForm = ({ requiresApprovalToComplete, presetValues = {} }) =>
    render(
      <MobileWorkingCloseWorkOrderForm
        workOrderReference="10001234"
        onSubmit={jest.fn()}
        isLoading={false}
        requiresApprovalToComplete={requiresApprovalToComplete}
        presetValues={presetValues}
      />
    )

  describe('on the work order status page', () => {
    it('is shown when the job needs approval and the visit is completed', async () => {
      renderForm({ requiresApprovalToComplete: true })

      await userEvent.click(await screen.findByLabelText('Visit completed'))

      expect(screen.getByTestId('completion-approval-notice')).toBeVisible()
    })

    it('is not shown when the job does not need approval', async () => {
      renderForm({ requiresApprovalToComplete: false })

      await userEvent.click(await screen.findByLabelText('Visit completed'))

      expect(
        screen.queryByTestId('completion-approval-notice')
      ).not.toBeInTheDocument()
    })

    it('is not shown when the job is closed with no access', async () => {
      renderForm({ requiresApprovalToComplete: true })

      await userEvent.click(await screen.findByLabelText('No access'))

      expect(
        screen.queryByTestId('completion-approval-notice')
      ).not.toBeInTheDocument()
    })
  })

  describe('on the follow-on details page', () => {
    const presetValues = {
      reason: 'Work Order Completed',
      followOnStatus: 'furtherWorkRequired',
    }

    const isVisible = (element) => {
      try {
        expect(element).toBeVisible()
        return true
      } catch {
        return false
      }
    }

    const goToFollowOnDetailsPage = async () => {
      await userEvent.click(await screen.findByText('Add details'))
    }

    it('is shown when the job needs approval', async () => {
      renderForm({ requiresApprovalToComplete: true, presetValues })

      await goToFollowOnDetailsPage()

      // Both pages are in the document and the status page is now hidden
      expect(screen.getByLabelText('Additional notes')).toBeVisible()

      const visibleNotices = screen
        .getAllByTestId('completion-approval-notice')
        .filter(isVisible)

      expect(visibleNotices).toHaveLength(1)
    })

    it('is not shown when the job does not need approval', async () => {
      renderForm({ requiresApprovalToComplete: false, presetValues })

      await goToFollowOnDetailsPage()

      expect(
        screen.queryByTestId('completion-approval-notice')
      ).not.toBeInTheDocument()
    })
  })
})
