import PropertyDetailsAddress from './PropertyDetailsAddress'
import PropertyFlags from './PropertyFlags'
import CautionaryAlerts from './CautionaryAlerts'
import { useAlerts } from '@/requests/hooks/useAlerts'
import { Address, Tenure } from '../../models/propertyTenure'

interface PropertyDetailsGridProps {
  propertyReference: string
  boilerHouseId: string
  address: Address
  subTypeDescription: string
  tenure: Tenure
  hasLinkToProperty: boolean
  canRaiseRepair: boolean
  tmoName: string
}

const PropertyDetailsGrid = ({
  propertyReference,
  boilerHouseId,
  address,
  subTypeDescription,
  tenure,
  hasLinkToProperty,
  canRaiseRepair,
  tmoName,
}: PropertyDetailsGridProps) => {
  const { alerts, isLoading: alertsLoading, error: alertsError } = useAlerts(
    propertyReference
  )

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half-from-desktop">
        <div className="lbh-body-s">
          <PropertyDetailsAddress
            address={address}
            propertyReference={propertyReference}
            subTypeDescription={subTypeDescription}
            hasLinkToProperty={hasLinkToProperty}
          />

          <CautionaryAlerts
            alerts={alerts}
            isLoading={alertsLoading}
            error={alertsError}
          />

          <PropertyFlags
            tenure={tenure}
            canRaiseRepair={canRaiseRepair}
            tmoName={tmoName}
            boilerHouseId={boilerHouseId}
          />
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsGrid
