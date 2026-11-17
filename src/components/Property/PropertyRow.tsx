import Link from 'next/link'
import { TR, TD } from '../Layout/Table'

interface Props {
  propertyReference: string
  address: string
  postalCode: string
  propertyType: string
}

const PropertyRow = ({
  propertyReference,
  address,
  postalCode,
  propertyType,
}: Props) => (
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

export default PropertyRow
