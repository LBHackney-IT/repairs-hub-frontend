import { useState } from 'react'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import PropertyFlags from './PropertyFlags'
import Alerts from './Alerts'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

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

          {alerts.length > 0 && (
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
              <Alerts
                alerts={alerts}
                setIsExpanded={setIsExpanded}
                isExpanded={isExpanded}
              />
            </ul>
          )}
          {alertsLoading && <Spinner resource="alerts" />}
          {alertsError && <ErrorMessage label={alertsError} />}

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
