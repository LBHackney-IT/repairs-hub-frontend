import PropertyDetailsAddress from './PropertyDetailsAddress'
import PropertyFlags from './PropertyFlags'
import CautionaryAlerts from './CautionaryAlerts'
import { Address, Tenure } from '../../models/propertyTenure'
import { CautionaryAlert } from '../../models/cautionaryAlerts'

interface PropertyDetailsGridProps {
  propertyReference: string
  boilerHouseId: string
  address: Address
  subTypeDescription: string
  tenure: Tenure
  hasLinkToProperty: boolean
  canRaiseRepair: boolean
  tmoName: string
  alerts: CautionaryAlert[]
  alertsLoading: boolean
  alertsError: string | null
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
  alerts,
  alertsLoading,
  alertsError,
}: PropertyDetailsGridProps) => (
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

export default PropertyDetailsGrid
