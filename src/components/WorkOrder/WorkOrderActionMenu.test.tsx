import { fireEvent, render, screen } from '@testing-library/react'
import UserContext, { User } from '../UserContext'
import WorkOrderActionMenu from './WorkOrderActionMenu'
import { WorkOrder } from '@/models/workOrder'
import { WORK_ORDER_ACTIONS } from '@/utils/workOrderActions'

const renderMenu = ({
  roles = ['contract_manager'],
  status = 'In Progress',
  closedDated,
  printClickHandler = jest.fn(),
}: {
  roles?: string[]
  status?: string
  closedDated?: string
  printClickHandler?: () => void
} = {}) =>
  render(
    <UserContext.Provider value={{ user: ({ roles } as unknown) as User }}>
      <WorkOrderActionMenu
        workOrder={
          new WorkOrder({ reference: '10000040', status, closedDated })
        }
        printClickHandler={printClickHandler}
      />
    </UserContext.Provider>
  )

const titleOf = (href: string) => {
  const action = WORK_ORDER_ACTIONS.find((a) => a.href === href)

  if (!action) throw new Error(`No work order action with href '${href}'`)

  return action.title
}

// Every available action is rendered as a radio option in the menu
const queryAction = (href: string) =>
  screen.queryByRole('radio', { name: titleOf(href) })

beforeEach(() => {
  window.localStorage.clear()
})

describe('WorkOrderActionMenu', () => {
  describe('general behaviour', () => {
    it('does not render when the user has no available actions', () => {
      // An approver has nothing to do with an in progress work order
      renderMenu({
        roles: ['completion_approval_manager'],
        status: 'In Progress',
      })

      expect(screen.queryByTestId('details')).not.toBeInTheDocument()
      expect(screen.queryAllByRole('radio')).toHaveLength(0)
    })

    it('renders when the work order is completion pending approval, even though it has a closed date', () => {
      renderMenu({
        roles: ['completion_approval_manager'],
        status: 'Completion Pending Approval',
        closedDated: '2026-11-20T10:00:00Z',
      })

      expect(queryAction('approve-completion')).toBeInTheDocument()
    })

    it.each(['Completed', 'Cancelled', 'No Access'])(
      'does not render for a closed work order with status %s',
      (status) => {
        renderMenu({
          // Permitted to print for every status, so would render if not closed
          roles: ['contract_manager'],
          status,
          closedDated: '2026-11-20T10:00:00Z',
        })

        expect(screen.queryByTestId('details')).not.toBeInTheDocument()
      }
    )

    it('calls the print handler, instead of navigating, when Print is selected', () => {
      const printClickHandler = jest.fn()

      renderMenu({
        roles: ['contract_manager'],
        status: 'In Progress',
        printClickHandler,
      })

      // Make Print the main action, then click it
      fireEvent.click(queryAction('print') as HTMLElement)

      // fireEvent returns false when the default action was prevented
      const notPrevented = fireEvent.click(
        screen.getByRole('link', { name: titleOf('print') })
      )

      expect(printClickHandler).toHaveBeenCalledTimes(1)
      expect(notPrevented).toBe(false)
    })
  })

  describe('Update', () => {
    it.each(['contractor', 'contract_manager'])(
      'is shown to the %s role',
      (role) => {
        renderMenu({ roles: [role], status: 'In Progress' })

        expect(queryAction('update')).toBeInTheDocument()
      }
    )

    it.each([
      'agent',
      'dlo_contractor',
      'contractor_cancel',
      'authorisation_manager',
      'operative',
      'budget_code_officer',
      'data_admin',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('update')).not.toBeInTheDocument()
    })

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Authorisation Pending Approval',
      'Variation Approved',
      'Variation Rejected',
    ])('is shown for the %s status', (status) => {
      renderMenu({ roles: ['contractor'], status })

      expect(queryAction('update')).toBeInTheDocument()
    })

    it.each([
      'Completion Pending Approval',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['contractor'], status })

      expect(queryAction('update')).not.toBeInTheDocument()
    })
  })

  describe('Close', () => {
    it.each(['contractor', 'contract_manager'])(
      'is shown to the %s role',
      (role) => {
        renderMenu({ roles: [role], status: 'In Progress' })

        expect(queryAction('close')).toBeInTheDocument()
      }
    )

    it.each([
      'agent',
      'dlo_contractor',
      'contractor_cancel',
      'authorisation_manager',
      'operative',
      'budget_code_officer',
      'data_admin',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('close')).not.toBeInTheDocument()
    })

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Authorisation Pending Approval',
      'Variation Approved',
      'Variation Rejected',
    ])('is shown for the %s status', (status) => {
      renderMenu({ roles: ['contractor'], status })

      expect(queryAction('close')).toBeInTheDocument()
    })

    it.each([
      'Completion Pending Approval',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['contractor'], status })

      expect(queryAction('close')).not.toBeInTheDocument()
    })
  })

  describe('Variation Authorisation', () => {
    it.each(['contract_manager'])('is shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'Variation Pending Approval' })

      expect(queryAction('variation-authorisation')).toBeInTheDocument()
    })

    it.each([
      'agent',
      'contractor',
      'dlo_contractor',
      'contractor_cancel',
      'authorisation_manager',
      'operative',
      'budget_code_officer',
      'data_admin',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'Variation Pending Approval' })

      expect(queryAction('variation-authorisation')).not.toBeInTheDocument()
    })

    it.each(['Variation Pending Approval'])(
      'is shown for the %s status',
      (status) => {
        renderMenu({ roles: ['contract_manager'], status })

        expect(queryAction('variation-authorisation')).toBeInTheDocument()
      }
    )

    it.each([
      'In Progress',
      'Authorisation Pending Approval',
      'Completion Pending Approval',
      'Variation Approved',
      'Variation Rejected',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['contract_manager'], status })

      expect(queryAction('variation-authorisation')).not.toBeInTheDocument()
    })
  })

  describe('Authorisation', () => {
    it.each(['authorisation_manager'])('is shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'Authorisation Pending Approval' })

      expect(queryAction('authorisation')).toBeInTheDocument()
    })

    it.each([
      'agent',
      'contractor',
      'dlo_contractor',
      'contract_manager',
      'contractor_cancel',
      'operative',
      'budget_code_officer',
      'data_admin',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'Authorisation Pending Approval' })

      expect(queryAction('authorisation')).not.toBeInTheDocument()
    })

    it.each(['Authorisation Pending Approval'])(
      'is shown for the %s status',
      (status) => {
        renderMenu({ roles: ['authorisation_manager'], status })

        expect(queryAction('authorisation')).toBeInTheDocument()
      }
    )

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Completion Pending Approval',
      'Variation Approved',
      'Variation Rejected',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['authorisation_manager'], status })

      expect(queryAction('authorisation')).not.toBeInTheDocument()
    })
  })

  describe('Approve Completion', () => {
    it.each(['completion_approval_manager', 'data_admin'])(
      'is shown to the %s role',
      (role) => {
        renderMenu({ roles: [role], status: 'Completion Pending Approval' })

        expect(queryAction('approve-completion')).toBeInTheDocument()
      }
    )

    it.each([
      'agent',
      'contractor',
      'dlo_contractor',
      'contract_manager',
      'contractor_cancel',
      'authorisation_manager',
      'operative',
      'budget_code_officer',
      'contract_admin',
      'followon_admin',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'Completion Pending Approval' })

      expect(queryAction('approve-completion')).not.toBeInTheDocument()
    })

    it.each(['Completion Pending Approval'])(
      'is shown for the %s status',
      (status) => {
        renderMenu({ roles: ['completion_approval_manager'], status })

        expect(queryAction('approve-completion')).toBeInTheDocument()
      }
    )

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Authorisation Pending Approval',
      'Variation Approved',
      'Variation Rejected',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['completion_approval_manager'], status })

      expect(queryAction('approve-completion')).not.toBeInTheDocument()
    })
  })

  describe('Cancel', () => {
    it.each([
      'agent',
      'authorisation_manager',
      'contract_manager',
      'contractor_cancel',
    ])('is shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('cancel')).toBeInTheDocument()
    })

    it.each([
      'contractor',
      'dlo_contractor',
      'operative',
      'budget_code_officer',
      'data_admin',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('cancel')).not.toBeInTheDocument()
    })

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Authorisation Pending Approval',
      'Variation Approved',
      'Variation Rejected',
    ])('is shown for the %s status', (status) => {
      renderMenu({ roles: ['agent'], status })

      expect(queryAction('cancel')).toBeInTheDocument()
    })

    it.each([
      'Completion Pending Approval',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['agent'], status })

      expect(queryAction('cancel')).not.toBeInTheDocument()
    })
  })

  describe('Print', () => {
    it.each([
      'agent',
      'authorisation_manager',
      'contract_manager',
      'contractor',
    ])('is shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('print')).toBeInTheDocument()
    })

    it.each([
      'dlo_contractor',
      'contractor_cancel',
      'operative',
      'budget_code_officer',
      'data_admin',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('print')).not.toBeInTheDocument()
    })

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Authorisation Pending Approval',
      'Completion Pending Approval',
      'Variation Approved',
      'Variation Rejected',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is shown for the %s status', (status) => {
      renderMenu({ roles: ['agent'], status })

      expect(queryAction('print')).toBeInTheDocument()
    })
  })

  describe('Edit', () => {
    it.each([
      'agent',
      'authorisation_manager',
      'contract_manager',
      'data_admin',
    ])('is shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('edit')).toBeInTheDocument()
    })

    it.each([
      'contractor',
      'dlo_contractor',
      'contractor_cancel',
      'operative',
      'budget_code_officer',
      'contract_admin',
      'followon_admin',
      'completion_approval_manager',
    ])('is not shown to the %s role', (role) => {
      renderMenu({ roles: [role], status: 'In Progress' })

      expect(queryAction('edit')).not.toBeInTheDocument()
    })

    it.each([
      'In Progress',
      'Variation Pending Approval',
      'Authorisation Pending Approval',
      'Variation Approved',
      'Variation Rejected',
    ])('is shown for the %s status', (status) => {
      renderMenu({ roles: ['agent'], status })

      expect(queryAction('edit')).toBeInTheDocument()
    })

    it.each([
      'Completion Pending Approval',
      'Completed',
      'Cancelled',
      'No Access',
    ])('is not shown for the %s status', (status) => {
      renderMenu({ roles: ['agent'], status })

      expect(queryAction('edit')).not.toBeInTheDocument()
    })
  })
})
