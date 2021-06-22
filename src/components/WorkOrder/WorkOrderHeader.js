import PropTypes from 'prop-types'
import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import TenureDetails from '../Property/TenureDetails'
import WorkOrderInfo from './WorkOrderInfo'
import AppointmentDetails from './AppointmentDetails'
import Operatives from './Operatives'

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
  const pastAppointmentStartTime = (date, startTime) => {
    if (!date || !startTime) {
      return false
    }

    const currentTime = new Date().getTime()
    const appointmentStartTime = new Date(`${date}T${startTime}`).getTime()

    return currentTime > appointmentStartTime
  }

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

        {workOrder.operatives.length > 0 &&
          workOrder.appointment &&
          pastAppointmentStartTime(
            workOrder.appointment.date,
            workOrder.appointment.start
          ) && <Operatives operatives={workOrder.operatives} />}
      </div>
    </div>
  )
}

WorkOrderHeader.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrder: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default WorkOrderHeader
