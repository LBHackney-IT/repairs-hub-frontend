import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem'
import { WorkOrder } from '../../../models/workOrder'
import { User } from '../../UserContext'

interface Props {
  workOrders: WorkOrder[] | null
  currentUser: User
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
