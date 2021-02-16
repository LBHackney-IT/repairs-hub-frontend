import PropTypes from 'prop-types'
import PropertyDetailsAddress from '../Property/PropertyDetailsAddress'
import TenureAlertDetails from '../Property/TenureAlertDetails'
import WorkOrderInfo from './WorkOrderInfo'
import AppointmentDetails from './AppointmentDetails'

const WorkOrderHeader = ({
  propertyReference,
  workOrder,
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  canRaiseRepair,
}) => {
  return (
    <div className="govuk-body-s govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <PropertyDetailsAddress
          address={address}
          propertyReference={propertyReference}
          subTypeDescription={subTypeDescription}
          hasLinkToProperty={true}
        />

        <TenureAlertDetails
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
        <AppointmentDetails workOrder={workOrder} />
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
