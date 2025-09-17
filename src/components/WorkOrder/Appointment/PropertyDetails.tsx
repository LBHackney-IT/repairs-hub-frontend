import { useState, useEffect } from 'react'
import { getAlerts } from '@/root/src/utils/requests/property'
import { GridRow, GridColumn } from '../../Layout/Grid'
import PropertyFlags from '../../Property/PropertyFlags'
import Alerts from '../../Property/Alerts'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'
import { CautionaryAlert } from '@/root/src/models/cautionaryAlerts'
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
  const [alerts, setAlerts] = useState<CautionaryAlert[] | []>([])
  const [alertsLoading, setAlertsLoading] = useState<boolean>(false)
  const [alertsError, setAlertsError] = useState<string | null>()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const fetchAlerts = async () => {
    setAlertsLoading(true)
    const alertsResponse = await getAlerts(propertyReference)

    if (!alertsResponse.success) {
      setAlertsError(alertsResponse.error.message)
      setAlertsLoading(false)
      return
    }

    setAlerts(alertsResponse.response.alerts)
    setAlertsLoading(false)
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <GridRow className="lbh-body-s govuk-!-margin-bottom-2">
      <GridColumn width="two-thirds">
        <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
          {subTypeDescription}: {address.addressLine}
        </h1>
        <ul
          className="lbh-list hackney-property-alerts"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: '1em',
            maxWidth: isExpanded ? '' : '30em',
          }}
        >
          {alertsLoading && <Spinner resource="alerts" />}
          {alerts?.length > 0 && (
            <Alerts
              alerts={alerts}
              setIsExpanded={setIsExpanded}
              isExpanded={isExpanded}
            />
          )}

          {alertsError && <ErrorMessage label={alertsError} />}
        </ul>

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
