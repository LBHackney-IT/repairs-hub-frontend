import { memo, useContext, useMemo } from 'react'
import UserContext from '../UserContext'
import MultiButton from '../Layout/MultiButton'
import { WORK_ORDER_ACTIONS } from 'src/utils/workOrderActions'
import { WorkOrder } from '@/models/workOrder'
import { STATUS_COMPLETION_PENDING_APPROVAL } from '@/utils/statusCodes'

interface Props {
  workOrder: WorkOrder
  printClickHandler: () => void
}

const WorkOrderActionMenu = ({ workOrder, printClickHandler }: Props) => {
  const { user } = useContext(UserContext)

  // The available actions only change if the work order's status does
  // (the user won't change while viewing the page)
  const choices = useMemo(
    () =>
      WORK_ORDER_ACTIONS.filter(
        (choice) =>
          choice.permittedRoles.some((role) => user.roles.includes(role)) &&
          choice.permittedStatuses.includes(workOrder.status)
      ).map((action) => {
        if (action.href === 'print') {
          return {
            ...action,
            onClickHandler: (e) => {
              e.preventDefault()
              printClickHandler()
            },
          }
        }

        return action
      }),
    [user, workOrder.status, printClickHandler]
  )

  const isCompletionPendingApproval =
    workOrder.status === STATUS_COMPLETION_PENDING_APPROVAL.description

  if (
    choices.length === 0 ||
    (workOrder.closedDated && !isCompletionPendingApproval)
  )
    return null

  return (
    <MultiButton
      name="workOrderMenu"
      label="Select work order"
      secondary={false}
      choices={choices}
      workOrderReference={workOrder.reference}
    />
  )
}

export default memo(WorkOrderActionMenu)
