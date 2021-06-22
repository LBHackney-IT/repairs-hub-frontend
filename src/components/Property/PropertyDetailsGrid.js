import PropTypes from 'prop-types'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import TenureDetails from './TenureDetails'

const PropertyDetailsGrid = ({
  propertyReference,
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  hasLinkToProperty,
  canRaiseRepair,
  tmoName,
}) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <div className="lbh-body-s">
          <PropertyDetailsAddress
            address={address}
            propertyReference={propertyReference}
            subTypeDescription={subTypeDescription}
            hasLinkToProperty={hasLinkToProperty}
          />
          <TenureDetails
            tenure={tenure}
            locationAlerts={locationAlerts}
            personAlerts={personAlerts}
            canRaiseRepair={canRaiseRepair}
            tmoName={tmoName}
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
  tmoName: PropTypes.string,
}

export default PropertyDetailsGrid
