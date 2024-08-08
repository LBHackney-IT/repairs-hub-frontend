import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import PropertyFlags from '../../Property/PropertyFlags'

const PropertyDetails = ({
  address,
  subTypeDescription,
  tenure,
  canRaiseRepair,
  propertyReference,
  boilerHouseId,
}) => {
  return (
    <GridRow className="lbh-body-s govuk-!-margin-bottom-2">
      <GridColumn width="two-thirds">
        <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
          {subTypeDescription}: {address.addressLine}
        </h1>

        <PropertyFlags
          tenure={tenure}
          canRaiseRepair={canRaiseRepair}
          propertyReference={propertyReference}
          boilerHouseId={boilerHouseId}
        />
      </GridColumn>
    </GridRow>
  )
}

PropertyDetails.propTypes = {
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  propertyReference: PropTypes.string.isRequired,
  boilerHouseId: PropTypes.string,
}

export default PropertyDetails
