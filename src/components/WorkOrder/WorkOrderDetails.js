import PropTypes from 'prop-types'
import PropertyDetailsGrid from '../Property/PropertyDetailsGrid'

const WorkOrderDetails = ({
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
    <div>
      <h1 className="govuk-heading-l">Works order: {workOrder.reference}</h1>
      <p className="govuk-body-m">{workOrder.description}</p>

      <PropertyDetailsGrid
        propertyReference={propertyReference}
        address={address}
        locationAlerts={locationAlerts}
        personAlerts={personAlerts}
        subTypeDescription={subTypeDescription}
        tenure={tenure}
        hasLinkToProperty={true}
        canRaiseRepair={canRaiseRepair}
      />
    </div>
  )
}

WorkOrderDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrder: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default WorkOrderDetails
