import Link from 'next/link'
import { TR, TD } from '../Layout/Table'

import type { PropertyListItem } from '@/root/src/models/propertyListItem'

const PropertyRow = ({
  propertyReference,
  address,
  postalCode,
  propertyType,
}: PropertyListItem) => (
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
