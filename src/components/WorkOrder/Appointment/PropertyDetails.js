import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import PropertyFlags from '../../Property/PropertyFlags'
import Alerts from '../../Property/Alerts'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'

const PropertyDetails = ({
  address,
  subTypeDescription,
  tenure,
  canRaiseRepair,
  propertyReference,
  boilerHouseId,
}) => {
  const [alerts, setAlerts] = useState([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [alertsError, setAlertsError] = useState()
  const [isExpanded, setIsExpanded] = useState(false)

  const getAlerts = () => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/alerts`,
    })
      .then((data) => {
        setAlerts(data.alerts)
      })
      .catch((error) => {
        console.error('Error loading alerts status:', error.response)

        setAlertsError(
          `Error loading alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setAlertsLoading(false))
  }

  useEffect(() => {
    setAlertsLoading(true)
    getAlerts()
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
          propertyReference={propertyReference}
          boilerHouseId={boilerHouseId}
        />
      </GridColumn>
    </GridRow>
  )
}

PropertyDetails.propTypes = {
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  propertyReference: PropTypes.string.isRequired,
  boilerHouseId: PropTypes.string,
}

export default PropertyDetails
