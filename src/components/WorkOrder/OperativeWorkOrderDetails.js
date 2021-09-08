import PropTypes from 'prop-types'
import WorkOrderHeader from './WorkOrderHeader'
import BackButton from '../Layout/BackButton/BackButton'
import { longMonthWeekday } from '../../utils/date'
import { WorkOrder } from '../../models/workOrder'

const WorkOrderDetails = ({
  property,
  workOrder,
  locationAlerts,
  personAlerts,
  tenure,
  schedulerSessionId,
}) => {
  return (
    <>
      <div class="govuk-panel govuk-panel--confirmation lbh-panel appointment-info">
        <h3 class="lbh-heading-h2">
          {longMonthWeekday(workOrder.appointment.date)}
          <br />
          {workOrder.appointment.start}-{workOrder.appointment.end}
        </h3>
      </div>
      <div className="govuk-!-display-none-print">
        <BackButton />

        <div width="two-thirds">
          <h2 className="lbh-heading-h2 display-inline govuk-!-margin-right-6">
            WO {workOrder.reference.toString().padStart(8, '0')}
          </h2>
        </div>
        <div width="one-third">
          {workOrder.isHigherPriority() ? (
            <h2 className=" text-dark-red lbh-heading-h2 display-inline govuk-!-margin-right-6">
              {workOrder.priority.split(' ').slice(-1)}
            </h2>
          ) : (
            <h2 className="lbh-heading-h2 display-inline govuk-!-margin-right-6">
              {workOrder.priority.split(' ').slice(-1)}
            </h2>
          )}
        </div>

        <p className="lbh-body-m">{workOrder.description}</p>

        <WorkOrderHeader
          propertyReference={property.propertyReference}
          workOrder={workOrder}
          address={property.address}
          locationAlerts={locationAlerts}
          personAlerts={personAlerts}
          subTypeDescription={property.hierarchyType.subTypeDescription}
          tenure={tenure}
          hasLinkToProperty={true}
          canRaiseRepair={property.canRaiseRepair}
          schedulerSessionId={schedulerSessionId}
        />
      </div>
    </>
  )
}

WorkOrderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default WorkOrderDetails
