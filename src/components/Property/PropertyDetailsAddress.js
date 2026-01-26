import PropTypes from 'prop-types'
import Link from 'next/link'

const Address = ({ address }) => {
  return (
    <div className="lbh-!-font-weight-bold">
      {address.addressLine}
      <br></br>
      {address.streetSuffix && (
        <>
          {address.streetSuffix}
          <br></br>
        </>
      )}
      <span className="govuk-!-font-size-14">{address.postalCode}</span>
    </div>
  )
}

const PropertyDetailsAddress = ({
  address,
  propertyReference,
  subTypeDescription,
  hasLinkToProperty,
}) => {
  return (
    <div className="property-details-main-section">
      <span className="govuk-!-font-size-16 govuk-!-margin-bottom-1">
        {subTypeDescription}
      </span>
      <br></br>
      {hasLinkToProperty ? (
        <Link href={`/properties/${propertyReference}`} legacyBehavior>
          <a className="lbh-link">
            <Address address={address} />
          </a>
        </Link>
      ) : (
        <Address address={address} />
      )}
    </div>
  )
}

PropertyDetailsAddress.propTypes = {
  address: PropTypes.object.isRequired,
  propertyReference: PropTypes.string.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  hasLinkToProperty: PropTypes.bool.isRequired,
}

export default PropertyDetailsAddress
