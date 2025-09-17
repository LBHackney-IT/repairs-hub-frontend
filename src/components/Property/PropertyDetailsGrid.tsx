import { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import PropertyFlags from './PropertyFlags'
import Alerts from './Alerts'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { getAlerts } from '../../utils/requests/property'
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
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half-from-desktop">
        <div className="lbh-body-s">
          <PropertyDetailsAddress
            address={address}
            propertyReference={propertyReference}
            subTypeDescription={subTypeDescription}
            hasLinkToProperty={hasLinkToProperty}
          />
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
            tmoName={tmoName}
            boilerHouseId={boilerHouseId}
          />
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsGrid
