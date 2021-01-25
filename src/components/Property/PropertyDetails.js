import PropTypes from 'prop-types'
import RaiseRepairStatus from './RaiseRepairStatus'
import TenureAlertDetails from './TenureAlertDetails'
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

            <TenureAlertDetails
              canRaiseRepair={canRaiseRepair}
              tenure={tenure}
              locationAlerts={locationAlerts}
              personAlerts={personAlerts}
            />
          </div>
        </div>
      </div>
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
