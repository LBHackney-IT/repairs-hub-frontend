import RaiseWorkOrderStatus from './RaiseWorkOrderStatus'
import PropertyDetailsGrid from './PropertyDetailsGrid'
import BackButton from '../Layout/BackButton'
import { isCurrentTimeOutOfHours } from '@/utils/helpers/completionDateTimes'
import Link from 'next/link'
import WarningInfoBox from '../Template/WarningInfoBox'
import { Property, Tenure } from '../../models/propertyTenure'
import { HealthAndSafetyHazardAlert } from '../Alerts/HealthAndSafetyHazardAlert'
import { useSimpleFeatureToggles } from '../../hooks/useSimpleFeatureToggle'
import Spinner from '../Spinner'
import WarrantyStatusFlag from './WarrantyStatusFlag'

interface PropertyDetailsProps {
  property: Property
  tenure: Tenure
  showLegalDisrepairFlag?: boolean
}

const PropertyDetails = ({
  tenure,
  property,
  showLegalDisrepairFlag = false,
}: PropertyDetailsProps) => {
  const [simpleFeatureToggles, isLoading] = useSimpleFeatureToggles()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
        {property.hierarchyType.subTypeDescription}:{' '}
        {property.address.addressLine}
      </h1>

      {showLegalDisrepairFlag && (
        <WarningInfoBox
          header="This property is currently under legal disrepair"
          text="Before raising a work order you must call the Legal Disrepair Team"
          style={{ maxWidth: 600 }}
        />
      )}

      {simpleFeatureToggles?.enableHealthAndSafetyFlag && (
        <HealthAndSafetyHazardAlert
          message={property?.healthAndSafetyRatingMessage}
        />
      )}

      <WarrantyStatusFlag status={property.warrantyStatus} />
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
}

export default PropertyDetails
