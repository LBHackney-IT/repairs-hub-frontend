import PropTypes from 'prop-types'

const PropertyDetails = ({ address, hierarchyType }) => (
  <div>
    <h1 className="govuk-heading-l">
      {hierarchyType.subTypeDescription}: {address.addressLine}
    </h1>

    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <p className="govuk-body-s">
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
          <span className="govuk-body-xs text-green">{address.postalCode}</span>
          <br></br>
        </p>
      </div>
    </div>
  </div>
)

PropertyDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
}

export default PropertyDetails
