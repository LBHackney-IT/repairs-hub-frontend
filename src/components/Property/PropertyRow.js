import PropTypes from 'prop-types'
import Link from 'next/link'
import { TR, TD } from '../Layout/Table'

const PropertyRow = ({ propertyReference, address, hierarchyType }) => (
  <TR className="govuk-table__row--clickable lbh-body-s">
    <TD>
      <Link href={`/properties/${propertyReference}`}>
        <a className="lbh-link">{address.shortAddress}</a>
      </Link>
    </TD>
    <TD>{address.postalCode}</TD>
    <TD>{hierarchyType.subTypeDescription}</TD>
    <TD>{propertyReference}</TD>
  </TR>
)

PropertyRow.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
}

export default PropertyRow
