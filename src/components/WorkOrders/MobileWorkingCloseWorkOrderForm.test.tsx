import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

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
        onSubmit={jest.fn()}
        isLoading={false}
        defaultValues={{}}
      />
    )

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('retains "No access" and "Final report" fields after a submission error', async () => {
    await act(async () => {
      render(
        <MobileWorkingCloseWorkOrderForm
          onSubmit={jest.fn()}
          isLoading={false}
          defaultValues={{
            reason: 'No Access',
            notes: 'Test final report',
          }}
        />
      )
    })

    expect(screen.getByLabelText('No access')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toBeInTheDocument()

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'))
    })

    expect(screen.getByLabelText('No access')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toBeInTheDocument()
  })

  it('retains "Visit completed" and "No further work required" after a submission error', async () => {
    await act(async () => {
      render(
        <MobileWorkingCloseWorkOrderForm
          onSubmit={jest.fn()}
          isLoading={false}
          defaultValues={{
            reason: 'Work Order Completed',
            followOnStatus: 'noFurtherWorkRequired',
            notes: 'Test final report',
          }}
        />
      )
    })

    expect(screen.getByLabelText('Visit completed')).toBeChecked()
    expect(screen.getByLabelText('No further work required')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toBeInTheDocument()

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'))
    })

    expect(screen.getByLabelText('Visit completed')).toBeChecked()
    expect(screen.getByLabelText('No further work required')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toBeInTheDocument()
  })

  it('retains all follow on fields (radios, select boxes, free text) after a submission error', async () => {
    await act(async () => {
      render(
        <MobileWorkingCloseWorkOrderForm
          onSubmit={jest.fn()}
          isLoading={false}
          defaultValues={{
            reason: 'Work Order Completed',
            followOnStatus: 'furtherWorkRequired',
            isEmergency: true,
            isMultipleOperatives: false,
            notes: 'Test final report',
            followOnTypeDescription: 'Replace tap',
            otherTrade: 'Glazing',
            workOrderFiles: [], // Bypass required file validation
          }}
        />
      )
    })

    // Main radios
    expect(screen.getByLabelText('Visit completed')).toBeChecked()
    expect(screen.getByLabelText('Further work required')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toHaveValue(
      'Test final report'
    )

    // Navigate to follow-on details page
    const addDetailsButton = screen.getByText('Add details')
    expect(addDetailsButton).toBeInTheDocument()
    expect(addDetailsButton).toBeEnabled()
    fireEvent.click(addDetailsButton)

    // Wait for follow-on fields to appear
    await waitFor(() =>
      expect(screen.getByLabelText('Trades required')).toBeInTheDocument()
    )

    // Follow on radios
    expect(screen.getByLabelText('Yes')).toBeChecked()
    expect(screen.getByLabelText('No')).not.toBeChecked()
    expect(
      screen.getByLabelText('Multiple operatives required')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('No')).toBeChecked()

    // Trades checkboxes and free text (simulate by clicking/filling, since react-hook-form doesn't support dynamic keys in defaultValues)
    await waitFor(() =>
      expect(screen.getByLabelText('Plumbing')).toBeInTheDocument()
    )
    fireEvent.click(screen.getByLabelText('Plumbing'))
    fireEvent.click(screen.getByLabelText('Other'))
    fireEvent.change(screen.getByLabelText('Please specify'), {
      target: { value: 'Glazing' },
    })
    fireEvent.change(screen.getByLabelText('Describe work required'), {
      target: { value: 'Replace tap' },
    })

    // Simulate form submission error
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'))
    })

    // All values should persist
    expect(screen.getByLabelText('Visit completed')).toBeChecked()
    expect(screen.getByLabelText('Further work required')).toBeChecked()
    expect(screen.getByLabelText('Final report')).toHaveValue(
      'Test final report'
    )
    expect(screen.getByLabelText('Yes')).toBeChecked()
    expect(screen.getByLabelText('No')).toBeChecked()
    expect(screen.getByLabelText('Plumbing')).toBeChecked()
    expect(screen.getByLabelText('Other')).toBeChecked()
    expect(screen.getByLabelText('Please specify')).toHaveValue('Glazing')
    expect(screen.getByLabelText('Describe work required')).toHaveValue(
      'Replace tap'
    )
  })
})
