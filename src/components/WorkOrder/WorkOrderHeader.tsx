import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import PropertyFlags from '../Property/PropertyFlags'
import ErrorMessage from '../Errors/ErrorMessage'
import WorkOrderInfo from './WorkOrderInfo'
import { WorkOrder } from '@/models/workOrder'

import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { Address, Tenure } from '../../models/propertyTenure'
import WorkOrderAppointmentDetailsHeader from './WorkOrderAppointmentDetailsHeader'

interface Props {
  propertyReference: string
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  address?: Address
  subTypeDescription?: string
  tenure?: Tenure
  canRaiseRepair?: boolean
  propertyError?: string | null
}

const WorkOrderHeader = (props: Props) => {
  const {
    propertyReference,
    workOrder,
    appointmentDetails,
    appointmentDetailsError,
    address,
    subTypeDescription,
    tenure,
    canRaiseRepair,
    propertyError,
  } = props

  return (
    <div className="lbh-body-s govuk-grid-row govuk-!-margin-bottom-6">
      <div className="govuk-grid-column-one-third">
        {propertyError && <ErrorMessage label={propertyError} />}
        {!propertyError && (
          <>
            <PropertyDetailsAddress
              address={address}
              propertyReference={propertyReference}
              subTypeDescription={subTypeDescription}
              hasLinkToProperty={true}
            />
            <PropertyFlags tenure={tenure} canRaiseRepair={canRaiseRepair} />
          </>
        )}
      </div>
      <div className="govuk-grid-column-one-third">
        <WorkOrderInfo workOrder={workOrder} />
      </div>
      <div className="govuk-grid-column-one-third">
        <WorkOrderAppointmentDetailsHeader
          appointmentDetails={appointmentDetails}
          appointmentDetailsError={appointmentDetailsError}
          workOrder={workOrder}
        />
      </div>
    </div>
  )
}

export default WorkOrderHeader
