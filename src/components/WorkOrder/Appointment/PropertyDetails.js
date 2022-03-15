import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import TenureDetails from '../../Property/TenureDetails'

const PropertyDetails = ({
  address,
  subTypeDescription,
  tenure,
  canRaiseRepair,
}) => {
  return (
    <GridRow className="lbh-body-s govuk-!-margin-bottom-2">
      <GridColumn width="two-thirds">
        <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
          {subTypeDescription}: {address.addressLine}
        </h1>

        <TenureDetails tenure={tenure} canRaiseRepair={canRaiseRepair} />
      </GridColumn>
    </GridRow>
  )
}

PropertyDetails.propTypes = {
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default PropertyDetails
