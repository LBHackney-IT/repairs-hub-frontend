import PropTypes from 'prop-types'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import TenureAlertDetails from './TenureAlertDetails'

const PropertyDetailsGrid = ({
  propertyReference,
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  hasLinkToProperty,
  canRaiseRepair,
}) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <div className="govuk-body-s">
          <PropertyDetailsAddress
            address={address}
            propertyReference={propertyReference}
            subTypeDescription={subTypeDescription}
            hasLinkToProperty={hasLinkToProperty}
          />

          <TenureAlertDetails
            tenure={tenure}
            locationAlerts={locationAlerts}
            personAlerts={personAlerts}
            canRaiseRepair={canRaiseRepair}
          />
        </div>
      </div>
    </div>
  )
}

PropertyDetailsGrid.propTypes = {
  propertyReference: PropTypes.string,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  hasLinkToProperty: PropTypes.bool,
  canRaiseRepair: PropTypes.bool,
}

export default PropertyDetailsGrid
