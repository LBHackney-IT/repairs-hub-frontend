import Link from 'next/link'

import type { Address as AddressModel } from '@/root/src/models/propertyTenure'

interface AddressProps {
  address: AddressModel
}

const Address = ({ address }: AddressProps) => {
  return (
    <div className="lbh-!-font-weight-bold">
      {address.addressLine}
      <br></br>
      {address.streetSuffix && (
        <>
          {address.streetSuffix}
          <br></br>
        </>
      )}
      <span className="govuk-!-font-size-14">{address.postalCode}</span>
    </div>
  )
}

interface Props {
  address: AddressModel
  propertyReference: string
  subTypeDescription: string
  hasLinkToProperty: boolean
}

const PropertyDetailsAddress = ({
  address,
  propertyReference,
  subTypeDescription,
  hasLinkToProperty,
}: Props) => {
  return (
    <div className="property-details-main-section">
      <span className="govuk-!-font-size-16 govuk-!-margin-bottom-1">
        {subTypeDescription}
      </span>
      <br></br>
      {hasLinkToProperty ? (
        <Link href={`/properties/${propertyReference}`} legacyBehavior>
          <a className="lbh-link">
            <Address address={address} />
          </a>
        </Link>
      ) : (
        <Address address={address} />
      )}
    </div>
  )
}

export default PropertyDetailsAddress
