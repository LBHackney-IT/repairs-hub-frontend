import MobileWorkingCloseWorkOrderForm from './MobileWorkingCloseWorkOrderForm'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

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
})
