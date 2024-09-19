import PropTypes from 'prop-types'
import Link from 'next/link'
import { TR, TD } from '../Layout/Table'

const PropertyRow = ({
  propertyReference,
  address,
  postalCode,
  propertyType,
}) => (
  <TR className="govuk-table__row--clickable lbh-body-s">
    <TD>
      <Link href={`/properties/${propertyReference}`} legacyBehavior>
        <a className="lbh-link">{address}</a>
      </Link>
    </TD>
    <TD>{postalCode}</TD>
    <TD>{propertyType}</TD>
    <TD>{propertyReference}</TD>
  </TR>
)

PropertyRow.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
}

export default PropertyRow
