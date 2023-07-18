import PropTypes from 'prop-types'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Alerts from '../Alerts'
import Tenure from '../Tenure'
import TenureDetail from '../TenureDetail'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import PropertyBoilerHouseDetails from '../PropertyBoilerHouseDetails'

const PropertyFlags = ({
  canRaiseRepair,
  tenure,
  tmoName,
  propertyReference,
  boilerHouseId,
  setParentLocationAlerts,
  setParentPersonAlerts,
}) => {
  //Properties with TMO names set to this value aren't actually TMOs
  const TMO_HACKNEY_DEFAULT = 'London Borough of Hackney'

  const [locationAlerts, setLocationAlerts] = useState([])
  const [locationAlertsLoading, setLocationAlertsLoading] = useState(false)
  const [locationAlertsError, setLocationAlertsError] = useState()

  const [personAlerts, setPersonAlerts] = useState([])
  const [personAlertsLoading, setPersonAlertsLoading] = useState(false)
  const [personAlertsError, setPersonAlertsError] = useState()

  const getLocationAlerts = () => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/location-alerts`,
    })
      .then((data) => {
        setLocationAlerts(data.alerts)
        setParentLocationAlerts && setParentLocationAlerts(data.alerts)
      })
      .catch((error) => {
        console.error('Error loading location alerts status:', error.response)

        setLocationAlertsError(
          `Error loading location alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setLocationAlertsLoading(false))
  }

  const getPersonAlerts = (tenancyAgreementReference) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${encodeURIComponent(
        tenancyAgreementReference
      )}/person-alerts`,
    })
      .then((data) => {
        setPersonAlerts(data.alerts)
        setParentPersonAlerts && setParentPersonAlerts(data.alerts)
      })
      .catch((error) => {
        console.error('Error loading person alerts status:', error.response)

        setPersonAlertsError(
          `Error loading person alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setPersonAlertsLoading(false))
  }

  const renderLocationAlerts = () =>
    locationAlerts.length > 0 && (
      <Alerts alerts={locationAlerts} alertType="Address" />
    )

  const renderPersonAlerts = () =>
    personAlerts.length > 0 && (
      <Alerts alerts={personAlerts} alertType="Contact" />
    )

  const showBoilerHouseDetails = () =>
    boilerHouseId !== '' && boilerHouseId !== null

  useEffect(() => {
    setLocationAlertsLoading(true)
    getLocationAlerts()
    if (tenure?.tenancyAgreementReference) {
      setPersonAlertsLoading(true)
      getPersonAlerts(tenure.tenancyAgreementReference)
    }
  }, [])

  return (
    <ul
      className="lbh-list hackney-property-alerts"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '1em',
      }}
    >
      {tenure && Object.keys(tenure).length > 0 && (
        <Tenure tenure={tenure} canRaiseRepair={canRaiseRepair} />
      )}

      {showBoilerHouseDetails() && (
        <PropertyBoilerHouseDetails boilerHouseId={boilerHouseId} />
      )}

      {locationAlertsLoading ? (
        <Spinner resource="locationAlerts" />
      ) : (
        renderLocationAlerts()
      )}

      {locationAlertsError && <ErrorMessage label={locationAlertsError} />}

      {tmoName && tmoName !== TMO_HACKNEY_DEFAULT && (
        <TenureDetail text="TMO" detail={tmoName} />
      )}

      {personAlertsLoading ? (
        <Spinner resource="personAlerts" />
      ) : (
        renderPersonAlerts()
      )}
      {personAlertsError && <ErrorMessage label={personAlertsError} />}
    </ul>
  )
}

PropertyFlags.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object,
  tmoName: PropTypes.string,
  propertyReference: PropTypes.string.isRequired,
  boilerHouseId: PropTypes.string.isRequired,
  setParentLocationAlerts: PropTypes.func,
  setParentPersonAlerts: PropTypes.func,
}

export default PropertyFlags
