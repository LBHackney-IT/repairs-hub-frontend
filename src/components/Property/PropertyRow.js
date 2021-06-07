import PropTypes from 'prop-types'
import Link from 'next/link'

const PropertyRow = ({ propertyReference, address, hierarchyType }) => (
  <tr className="govuk-table__row govuk-table__row--clickable lbh-body-s">
    <td className="govuk-table__cell">
      <Link href={`/properties/${propertyReference}`}>
        <a className="lbh-link">{address.shortAddress}</a>
      </Link>
    </td>
    <td className="govuk-table__cell">{address.postalCode}</td>
    <td className="govuk-table__cell">{hierarchyType.subTypeDescription}</td>
    <td className="govuk-table__cell">{propertyReference}</td>
  </tr>
)

PropertyRow.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
}

export default PropertyRow
