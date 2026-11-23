import WorkOrderHeader from './WorkOrderHeader'
import WorkOrderAlerts from './WorkOrderAlerts'
import { WorkOrder } from '@/models/workOrder'
import FollowOnFlag from '../Flags/FollowOnFlag'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import { Property, Tenure } from '../../models/propertyTenure'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

interface Props {
  property?: Property
  propertyError?: string | null
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  tenure?: Tenure
  alertsLoading: boolean
  alertsError: string | null
  alerts: CautionaryAlert[]
}

const WorkOrderDetails = (props: Props) => {
  const {
    property,
    propertyError,
    workOrder,
    appointmentDetails,
    appointmentDetailsError,
    tenure,
    alerts,
    alertsLoading,
    alertsError,
  } = props

  return (
    <>
      {workOrder?.isFollowOn && (
        <div className="govuk-!-margin-top-2">
          <FollowOnFlag />
        </div>
      )}

      <p className="lbh-body-m">{workOrder.description}</p>

      <WorkOrderAlerts
        alerts={alerts}
        isLoading={alertsLoading}
        error={alertsError}
      />

      <WorkOrderHeader
        propertyReference={
          property?.propertyReference ?? workOrder.propertyReference
        }
        propertyError={propertyError}
        workOrder={workOrder}
        appointmentDetails={appointmentDetails}
        appointmentDetailsError={appointmentDetailsError}
        address={property?.address}
        subTypeDescription={property?.hierarchyType?.subTypeDescription}
        tenure={tenure}
        canRaiseRepair={property?.canRaiseRepair}
      />
    </>
  )
}

export default WorkOrderDetails
