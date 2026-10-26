import type {
  CurrentUser,
  WorkOrderType,
} from '@/root/src/types/variations/types'
import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem'

interface Props {
  workOrders: WorkOrderType[] | null
  currentUser: Pick<CurrentUser, 'operativePayrollNumber'>
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
