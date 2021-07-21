import PropTypes from 'prop-types'
import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import TenureDetails from '../Property/TenureDetails'
import WorkOrderInfo from './WorkOrderInfo'
import AppointmentDetails from './AppointmentDetails'
import Operatives from './Operatives'
import { formatDateTime } from 'src/utils/time'
import { WorkOrder } from '../../models/work-order'

const WorkOrderHeader = ({
  propertyReference,
  workOrder,
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  canRaiseRepair,
  schedulerSessionId,
}) => {
  return (
    <div className="lbh-body-s govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <PropertyDetailsAddress
          address={address}
          propertyReference={propertyReference}
          subTypeDescription={subTypeDescription}
          hasLinkToProperty={true}
        />

        <TenureDetails
          tenure={tenure}
          locationAlerts={locationAlerts}
          personAlerts={personAlerts}
          canRaiseRepair={canRaiseRepair}
        />
      </div>
      <div className="govuk-grid-column-one-third">
        <WorkOrderInfo workOrder={workOrder} />
      </div>
      <div className="govuk-grid-column-one-third">
        <AppointmentDetails
          workOrder={workOrder}
          schedulerSessionId={schedulerSessionId}
        />
        <div className="lbh-body-xs">
          <span>Assigned to: {workOrder.owner}</span>
        </div>
        {workOrder.closedDated && (
          <div className="lbh-body-xs">
            <span>
              <strong>
                {workOrder.completionReason()}:{' '}
                {formatDateTime(new Date(workOrder.closedDated))}
              </strong>
            </span>
          </div>
        )}
        {workOrder.operatives.length > 0 &&
          workOrder.appointment &&
          workOrder.appointmentStartTimePassed() && (
            <Operatives operatives={workOrder.operatives} />
          )}
      </div>
    </div>
  )
}

WorkOrderHeader.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default WorkOrderHeader
