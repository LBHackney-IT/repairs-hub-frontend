import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { agent } from '../../../factories/agent'
import UserContext from '../UserContext'
import CloseWorkOrderByProxy from './CloseWorkOrderByProxy'
import { WorkOrder } from '@/models/workOrder'
import {
  completeWorkOrderRequest,
  getAppointmentDetailsRequest,
  getWorkOrderDetailsRequest,
} from '@/requests/workOrders'
import { useSimpleFeatureToggles } from '@/hooks/useSimpleFeatureToggle'

jest.mock('@/requests/workOrders')
jest.mock('@/requests/operatives')
jest.mock('@/requests/jobStatusUpdate')
jest.mock('@/hooks/useSimpleFeatureToggle')
jest.mock('../WorkOrder/Photos/hooks/uploadFiles')
jest.mock('../WorkOrder/Photos/hooks/uploadFiles/cacheFile')
jest.mock('../../utils/cloudwatchLogger', () => () => ({ log: jest.fn() }))

const getWorkOrderDetails = getWorkOrderDetailsRequest as jest.Mock
const getAppointmentDetails = getAppointmentDetailsRequest as jest.Mock
const completeWorkOrder = completeWorkOrderRequest as jest.Mock
const featureToggles = useSimpleFeatureToggles as jest.Mock

const REFERENCE = '10000040'

// H06 is the contractor reference that requires approval to complete
const mockWorkOrder = (contractorReference: string) =>
  getWorkOrderDetails.mockResolvedValue({
    success: true,
    response: new WorkOrder({
      reference: REFERENCE,
      contractorReference,
      dateRaised: '2021-01-01T10:00:00.000Z',
      canAssignOperative: false,
    }),
    error: null,
  })

const mockToggles = (
  enableCompletionApprovalStep: boolean,
  isLoading = false
) =>
  featureToggles.mockReturnValue([
    { enableCompletionApprovalStep },
    isLoading,
    null,
  ])

const renderProxy = () =>
  render(
    <UserContext.Provider value={{ user: agent }}>
      <CloseWorkOrderByProxy reference={REFERENCE} />
    </UserContext.Provider>
  )

const fillInFormAndGoToSummary = async (reasonLabel: string) => {
  await userEvent.click(await screen.findByLabelText(reasonLabel))
  if (reasonLabel === 'Visit completed') {
    await userEvent.click(screen.getByLabelText('No further work required'))
  }
  fireEvent.change(screen.getByTestId('completionDate'), {
    target: { value: '2021-01-12' },
  })
  fireEvent.change(screen.getByTestId('completionTime-hour'), {
    target: { value: '14' },
  })
  fireEvent.change(screen.getByTestId('completionTime-minutes'), {
    target: { value: '30' },
  })
  await userEvent.click(
    screen.getByRole('button', { name: 'Close work order' })
  )
  await screen.findByRole('button', { name: 'Confirm and close' })
}

const getNotice = () => screen.queryByTestId('completion-approval-notice')

describe('CloseWorkOrderByProxy', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    mockToggles(true)
    mockWorkOrder('H06')
    getAppointmentDetails.mockResolvedValue({
      success: true,
      response: { operatives: [] },
      error: null,
    })
    completeWorkOrder.mockResolvedValue({})
  })

  // Tests cover the completion approval functionality only.
  // Placeholder to add tests for the rest of this component.
  it.todo('has tests for the rest of the component')

  describe('loading', () => {
    it('shows a spinner while the feature toggles are loading', async () => {
      mockToggles(true, true)

      renderProxy()

      expect(await screen.findByText('Loading')).toBeInTheDocument()
      expect(screen.queryByRole('form')).not.toBeInTheDocument()
    })
  })

  describe('completion approval notice', () => {
    it('is shown on the summary page when the job needs approval and is being completed', async () => {
      renderProxy()

      await fillInFormAndGoToSummary('Visit completed')

      expect(getNotice()).toBeVisible()
    })

    it('is not shown on the form page', async () => {
      renderProxy()

      await userEvent.click(await screen.findByLabelText('Visit completed'))

      expect(getNotice()).not.toBeInTheDocument()
    })

    it('is not shown when the feature toggle is off', async () => {
      mockToggles(false)

      renderProxy()
      await fillInFormAndGoToSummary('Visit completed')

      expect(getNotice()).not.toBeInTheDocument()
    })

    it('is not shown when the job does not need approval', async () => {
      mockWorkOrder('H01')

      renderProxy()
      await fillInFormAndGoToSummary('Visit completed')

      expect(getNotice()).not.toBeInTheDocument()
    })

    it('is not shown when the job is closed with no access', async () => {
      renderProxy()

      await fillInFormAndGoToSummary('No access')

      expect(getNotice()).not.toBeInTheDocument()
    })
  })

  describe('success page', () => {
    const confirm = async () => {
      await userEvent.click(
        screen.getByRole('button', { name: 'Confirm and close' })
      )
    }

    it('says completion is pending approval when the job needs approval', async () => {
      renderProxy()
      await fillInFormAndGoToSummary('Visit completed')

      await confirm()

      expect(
        await screen.findByText(
          'Work order closed, completion pending approval'
        )
      ).toBeInTheDocument()
    })

    it('says the work order is closed when the job does not need approval', async () => {
      mockWorkOrder('H01')

      renderProxy()
      await fillInFormAndGoToSummary('Visit completed')

      await confirm()

      expect(await screen.findByText('Work order closed')).toBeInTheDocument()
    })

    it('says the work order is closed when the job is closed with no access', async () => {
      renderProxy()
      await fillInFormAndGoToSummary('No access')

      await confirm()

      expect(await screen.findByText('Work order closed')).toBeInTheDocument()
    })
  })
})
