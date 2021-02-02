import PropTypes from 'prop-types'
import RaiseRepairStatus from './RaiseRepairStatus'
import PropertyDetailsGrid from './PropertyDetailsGrid'
import RepairsHistoryView from './RepairsHistory/RepairsHistoryView'
import BackButton from '../Layout/BackButton/BackButton'

const PropertyDetails = ({
  propertyReference,
  address,
  hierarchyType,
  canRaiseRepair,
  locationAlerts,
  personAlerts,
  tenure,
}) => {
  return (
    <div>
      <BackButton />
      <h1 className="govuk-heading-l govuk-!-margin-bottom-2">
        {hierarchyType.subTypeDescription}: {address.addressLine}
      </h1>
      <div>
        <RaiseRepairStatus
          canRaiseRepair={canRaiseRepair}
          description={hierarchyType.subTypeDescription}
          propertyReference={propertyReference}
        />
      </div>
      <PropertyDetailsGrid
        propertyReference={propertyReference}
        address={address}
        locationAlerts={locationAlerts}
        personAlerts={personAlerts}
        subTypeDescription="Property details"
        tenure={tenure}
        canRaiseRepair={canRaiseRepair}
        hasLinkToProperty={false}
      />
      {canRaiseRepair && (
        <RepairsHistoryView propertyReference={propertyReference} />
      )}
    </div>
  )
}

PropertyDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default PropertyDetails
