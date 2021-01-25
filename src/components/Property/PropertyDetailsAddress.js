import PropTypes from 'prop-types'

const PropertyDetailsAddress = ({ address }) => {
  return (
    <>
      {address.addressLine}
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
    </>
  )
}

PropertyDetailsAddress.propTypes = {
  address: PropTypes.object.isRequired,
}

export default PropertyDetailsAddress
