import Link from 'next/link'

const PropertyRow = ({ propertyReference, address, hierarchyType }) => (
  <tr className="govuk-table__row govuk-table__row--clickable govuk-body-s">
    <td className="govuk-table__cell">
      <Link href={`/properties/${propertyReference}`}>
        <a>{address.shortAddress}</a>
      </Link>
    </td>
    <td className="govuk-table__cell">{address.postalCode}</td>
    <td className="govuk-table__cell">{hierarchyType.subTypeDescription}</td>
    <td className="govuk-table__cell">{propertyReference}</td>
  </tr>
)

export default PropertyRow
