import PropTypes from 'prop-types'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import PropertyFlags from './PropertyFlags'

const PropertyDetailsGrid = ({
  propertyReference,
  boilerHouseId,
  address,
  subTypeDescription,
  tenure,
  hasLinkToProperty,
  canRaiseRepair,
  tmoName,
}) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half-from-desktop">
        <div className="lbh-body-s">
          <PropertyDetailsAddress
            address={address}
            propertyReference={propertyReference}
            subTypeDescription={subTypeDescription}
            hasLinkToProperty={hasLinkToProperty}
          />
          <PropertyFlags
            tenure={tenure}
            canRaiseRepair={canRaiseRepair}
            tmoName={tmoName}
            boilerHouseId={boilerHouseId}
          />
        </div>
      </div>
    </div>
  )
}

PropertyDetailsGrid.propTypes = {
  propertyReference: PropTypes.string,
  boilerHouseId: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string,
  tenure: PropTypes.object.isRequired,
  hasLinkToProperty: PropTypes.bool,
  canRaiseRepair: PropTypes.bool,
  tmoName: PropTypes.string,
}

export default PropertyDetailsGrid
