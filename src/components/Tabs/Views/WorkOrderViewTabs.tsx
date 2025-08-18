import { WorkOrder } from '@/root/src/models/workOrder'
import Tabs from '..'
import { TabName } from '../tabNames'
import { useContext } from 'react'
import UserContext from '../../UserContext'
import { canSeeRelatedWorkOrdersTab } from '@/root/src/utils/userPermissions'
import { WorkOrderAppointmentDetails } from '@/root/src/models/workOrderAppointmentDetails'

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
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  loadingAppointmentDetails: boolean
}

const WorkOrderViewTabs = (props: Props) => {
  const {
    propertyReference,
    workOrderReference,
    tasksAndSors,
    budgetCode,
    workOrder,
    appointmentDetails,
    appointmentDetailsError,
    loadingAppointmentDetails,
  } = props

  const { user } = useContext(UserContext)

  // Contractor cannot view RelatedWorkOrders tab
  const filteredTabs = !canSeeRelatedWorkOrdersTab(user)
    ? tabsList.filter((x) => x !== TabName.RelatedWorkOrders)
    : tabsList

  return (
    <Tabs
      tabsList={filteredTabs}
      propertyReference={propertyReference}
      workOrderReference={workOrderReference}
      tasksAndSors={tasksAndSors}
      budgetCode={budgetCode}
      workOrder={workOrder}
      appointmentDetails={appointmentDetails}
      appointmentDetailsError={appointmentDetailsError}
      loadingAppointmentDetails={loadingAppointmentDetails}
    />
  )
}

export default WorkOrderViewTabs
