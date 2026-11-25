import RaiseWorkOrderStatus from './RaiseWorkOrderStatus'
import PropertyDetailsGrid from './PropertyDetailsGrid'
import BackButton from '../Layout/BackButton'
import { isCurrentTimeOutOfHours } from '@/utils/helpers/completionDateTimes'
import Link from 'next/link'
import LegalDisrepairFlag from './LegalDisrepairFlag'
import UnderWarrantyFlag from './UnderWarrantyFlag'
import { Property, Tenure } from '../../models/propertyTenure'
import { HealthAndSafetyHazardAlert } from '../Alerts/HealthAndSafetyHazardAlert'

interface PropertyDetailsProps {
  property: Property
  tenure: Tenure
  showLegalDisrepairFlag?: boolean
  showUnderWarrantyFlag?: boolean
  showHealthAndSafetyFlag?: boolean
}

const PropertyDetails = ({
  tenure,
  property,
  showLegalDisrepairFlag = false,
  showUnderWarrantyFlag = false,
  showHealthAndSafetyFlag = false,
}: PropertyDetailsProps) => (
  <div>
    <BackButton />
    <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
      {property.hierarchyType.subTypeDescription}:{' '}
      {property.address.addressLine}
    </h1>

    {showLegalDisrepairFlag && <LegalDisrepairFlag />}
    {showHealthAndSafetyFlag && (
      <HealthAndSafetyHazardAlert
        message={property?.healthAndSafetyRatingMessage}
      />
    )}

    {showUnderWarrantyFlag && <UnderWarrantyFlag />}
    <div>
      <RaiseWorkOrderStatus
        canRaiseRepair={property.canRaiseRepair}
        description={property.hierarchyType.subTypeDescription}
        propertyReference={property.propertyReference}
      />
    </div>
    {isCurrentTimeOutOfHours() && (
      <div>
        <Link href={process.env.NEXT_PUBLIC_OUT_OF_HOURS_LINK} legacyBehavior>
          <a
            target="_blank"
            rel="noopener"
            className="lbh-link lbh-body-l lbh-!-font-weight-medium"
          >
            Out of hours note
          </a>
        </Link>
      </div>
    )}
    <PropertyDetailsGrid
      propertyReference={property.propertyReference}
      boilerHouseId={property.boilerHouseId}
      address={property.address}
      subTypeDescription="Property details"
      tenure={tenure}
      canRaiseRepair={property.canRaiseRepair}
      hasLinkToProperty={false}
      tmoName={property.tmoName}
    />
  </div>
)

export default PropertyDetails
