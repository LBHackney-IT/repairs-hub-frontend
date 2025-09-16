import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import PropTypes from 'prop-types'
import PropertyDetailsAddress from './PropertyDetailsAddress'
import PropertyFlags from './PropertyFlags'
import Alerts from './Alerts'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'

const PropertyDetailsGrid = ({
  propertyReference,
  boilerHouseId,
  address,
  subTypeDescription,
  tenure,
  hasLinkToProperty,
  canRaiseRepair,
  tmoName,
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

PropertyDetailsGrid.propTypes = {
  propertyReference: PropTypes.string,
  boilerHouseId: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string,
  tenure: PropTypes.object.isRequired,
  hasLinkToProperty: PropTypes.bool,
  canRaiseRepair: PropTypes.bool,
  tmoName: PropTypes.string,
}

export default PropertyDetailsGrid
