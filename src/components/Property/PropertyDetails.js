import PropTypes from 'prop-types'
import Alerts from './Alerts'
import Tenure from './Tenure'

const PropertyDetails = ({
  address,
  hierarchyType,
  locationAlerts,
  personAlerts,
  tenure,
}) => (
  <div>
    <h1 className="govuk-heading-l">
      {hierarchyType.subTypeDescription}: {address.addressLine}
    </h1>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <div className="govuk-body-s">
          <div className="property-details-main-section">
            <span className="govuk-body-xs">Property details</span>
            <br></br>
            <span className="govuk-!-font-weight-bold text-green">
              {address.addressLine}
            </span>
            <br></br>
            {address.streetSuffix && (
              <>
                <span className="govuk-!-font-weight-bold text-green">
                  {address.streetSuffix}
                </span>
                <br></br>
              </>
            )}
            <span className="govuk-body-xs text-green">
              {address.postalCode}
            </span>
          </div>

          {(Object.keys(tenure).length > 0 ||
            locationAlerts.length > 0 ||
            personAlerts.length > 0) && (
            <>
              <ul className="hackney-property-alerts">
                <Tenure tenure={tenure} />
                <Alerts alerts={locationAlerts} alertType="Address" />
                <Alerts alerts={personAlerts} alertType="Contact" />
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)

PropertyDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default PropertyDetails
