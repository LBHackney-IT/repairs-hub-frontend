import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem'
import { CurrentUser, WorkOrderType } from '../../../types/variations/types'

interface Props {
  workOrders: WorkOrderType[] | null
  currentUser: CurrentUser
}

export const MobileWorkingWorkOrderListItems = ({
  workOrders,
  currentUser,
}: Props) => {
  const formatStatusText = (statusText: string) => {
    const status = statusText.toLowerCase()

    if (status === 'no access') return 'No access'
    if (status === 'completed') return 'Completed'

    return ''
  }

  if (workOrders === null || workOrders?.length === 0) {
    return <></>
  }

  return workOrders.map((workOrder, index) => (
    <MobileWorkingWorkOrderListItem
      key={index}
      workOrder={workOrder}
      index={index}
      statusText={(() => formatStatusText(workOrder.status))()}
      currentUser={currentUser}
    />
  ))
}
