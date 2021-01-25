import PropTypes from 'prop-types'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import TenureAlertDetails from './TenureAlertDetails'
import Link from 'next/link'

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
          <div className="property-details-main-section">
            <span className="govuk-body-xs">{subTypeDescription}</span>
            <br></br>
            <span className="govuk-!-font-weight-bold text-green">
              {hasLinkToProperty ? (
                <Link href={`/properties/${propertyReference}`}>
                  <a>
                    <PropertyDetailsAddress address={address} />
                  </a>
                </Link>
              ) : (
                <PropertyDetailsAddress address={address} />
              )}
            </span>
          </div>

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
