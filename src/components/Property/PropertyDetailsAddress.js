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
Address.propTypes = {
  address: PropTypes.shape({
    addressLine: PropTypes.string.isRequired,
    streetSuffix: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
  }).isRequired,
}

const PropertyDetailsAddress = ({
  address,
  propertyReference,
  subTypeDescription,
  hasLinkToProperty,
}) => {
  return (
    <div className="property-details-main-section">
      <span className="govuk-!-font-size-14">{subTypeDescription}</span>
      <br></br>
      {hasLinkToProperty ? (
        <Link href={`/properties/${propertyReference}`}>
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
  address: PropTypes.shape({
    addressLine: PropTypes.string.isRequired,
    streetSuffix: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
  }).isRequired,
  propertyReference: PropTypes.string.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  hasLinkToProperty: PropTypes.bool.isRequired,
}

export default PropertyDetailsAddress
