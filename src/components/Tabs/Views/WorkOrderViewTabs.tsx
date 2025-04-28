import { WorkOrder } from '@/root/src/models/workOrder'
import Tabs from '..'
import { TabName } from '../types'
import { useContext, useMemo } from 'react'
import UserContext from '../../UserContext'
import { canSeeRelatedWorkOrdersTab } from '@/root/src/utils/userPermissions'

const tabsList: TabName[] = [
  TabName.TasksAndSors,
  TabName.Notes,
  TabName.PendingVariation,
  TabName.WorkOrderHistory,
  TabName.RelatedWorkOrders,
  TabName.Photos,
]

interface Props {
  propertyReference: string
  workOrderReference: string
  tasksAndSors: any
  budgetCode: any
  workOrder: WorkOrder
}

const WorkOrderViewTabs = (props: Props) => {
  const {
    propertyReference,
    workOrderReference,
    tasksAndSors,
    budgetCode,
    workOrder,
  } = props

  const { user } = useContext(UserContext)

  // Contractor cannot view RelatedWorkOrders tab
  const filteredTabs = useMemo(
    () =>
      canSeeRelatedWorkOrdersTab(user)
        ? tabsList
        : tabsList.filter((x) => x !== TabName.RelatedWorkOrders),
    [user]
  )

  return (
    <Tabs
      tabsList={filteredTabs}
      propertyReference={propertyReference}
      workOrderReference={workOrderReference}
      tasksAndSors={tasksAndSors}
      budgetCode={budgetCode}
      workOrder={workOrder}
    />
  )
}

export default WorkOrderViewTabs
