import { WorkOrder } from '@/root/src/models/workOrder'
import Tabs from '..'
import { TabName } from '../types'

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

  return (
    <Tabs
      tabsList={tabsList}
      propertyReference={propertyReference}
      workOrderReference={workOrderReference}
      tasksAndSors={tasksAndSors}
      budgetCode={budgetCode}
      workOrder={workOrder}
    />
  )
}

export default WorkOrderViewTabs
