import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import PropertyFlags from '../Property/PropertyFlags'
import WorkOrderInfo from './WorkOrderInfo'
import { WorkOrder } from '@/models/workOrder'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { Tenure } from '../../models/propertyTenure'
import WorkOrderAppointmentDetailsHeader from './WorkOrderAppointmentDetailsHeader'

interface Props {
  propertyReference: string
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  loadingAppointmentDetails: boolean
  address: object
  subTypeDescription: string
  tenure: Tenure
  canRaiseRepair: boolean
}

const WorkOrderHeader = (props: Props) => {
  const {
    propertyReference,
    workOrder,
    appointmentDetails,
    appointmentDetailsError,
    loadingAppointmentDetails,
    address,
    subTypeDescription,
    tenure,
    canRaiseRepair,
  } = props

  return (
    <div className="lbh-body-s govuk-grid-row govuk-!-margin-bottom-6">
      <div className="govuk-grid-column-one-third">
        <PropertyDetailsAddress
          address={address}
          propertyReference={propertyReference}
          subTypeDescription={subTypeDescription}
          hasLinkToProperty={true}
        />
        <PropertyFlags tenure={tenure} canRaiseRepair={canRaiseRepair} />
      </div>
      <div className="govuk-grid-column-one-third">
        <WorkOrderInfo workOrder={workOrder} />
      </div>
      <div className="govuk-grid-column-one-third">
        <WorkOrderAppointmentDetailsHeader
          appointmentDetails={appointmentDetails}
          appointmentDetailsError={appointmentDetailsError}
          loadingAppointmentDetails={loadingAppointmentDetails}
          workOrder={workOrder}
        />
      </div>
    </div>
  )
}

export default WorkOrderHeader
