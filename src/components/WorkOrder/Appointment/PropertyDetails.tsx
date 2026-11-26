import { useCautionaryAlerts } from '@/requests/hooks/useCautionaryAlerts'
import { GridRow, GridColumn } from '../../Layout/Grid'
import PropertyFlags from '../../Property/PropertyFlags'
import CautionaryAlerts from '../../Property/CautionaryAlerts'
import { Address, Tenure } from '@/root/src/models/propertyTenure'

interface PropertyDetailsProps {
  address: Address
  subTypeDescription: string
  tenure: Tenure
  canRaiseRepair: boolean
  propertyReference: string
  boilerHouseId: string
}

const PropertyDetails = ({
  address,
  subTypeDescription,
  tenure,
  canRaiseRepair,
  propertyReference,
  boilerHouseId,
}: PropertyDetailsProps) => {
  const {
    alerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = useCautionaryAlerts(propertyReference)

  return (
    <GridRow className="lbh-body-s govuk-!-margin-bottom-2">
      <GridColumn width="two-thirds">
        <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
          {subTypeDescription}: {address.addressLine}
        </h1>
        <CautionaryAlerts
          alerts={alerts}
          isLoading={alertsLoading}
          error={alertsError}
        />

        <PropertyFlags
          tenure={tenure}
          canRaiseRepair={canRaiseRepair}
          boilerHouseId={boilerHouseId}
        />
      </GridColumn>
    </GridRow>
  )
}

export default PropertyDetails
