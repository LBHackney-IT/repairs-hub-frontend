import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Alerts from '../Alerts'
import TenureComponent from '../Tenure'
import TenureDetail from '../TenureDetail'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import PropertyBoilerHouseDetails from '../PropertyBoilerHouseDetails'
import {
  CautionaryAlert,
  CautionaryAlertsResponse,
} from '@/root/src/models/cautionaryAlerts'
import { Tenure } from '@/root/src/models/propertyTenure'

interface Props {
  canRaiseRepair: boolean
  tenure: Tenure
  tmoName?: string
  propertyReference: string
  boilerHouseId?: string
  setParentLocationAlerts?: (alerts: CautionaryAlert[]) => void
  setParentPersonAlerts?: (alerts: CautionaryAlert[]) => void
}

//Properties with TMO names set to this value aren't actually TMOs
const TMO_HACKNEY_DEFAULT = 'London Borough of Hackney'

const PropertyFlags = (props: Props) => {
  const {
    canRaiseRepair,
    tenure,
    tmoName,
    propertyReference,
    boilerHouseId,
    setParentLocationAlerts,
    setParentPersonAlerts,
  } = props

  const [locationAlerts, setLocationAlerts] = useState<CautionaryAlert[]>([])
  const [locationAlertsLoading, setLocationAlertsLoading] = useState(false)
  const [locationAlertsError, setLocationAlertsError] = useState<
    string | null
  >()

  const [personAlerts, setPersonAlerts] = useState<CautionaryAlert[]>([])
  const [personAlertsLoading, setPersonAlertsLoading] = useState(false)
  const [personAlertsError, setPersonAlertsError] = useState<string | null>()

  const getLocationAlerts = () => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/location-alerts`,
    })
      .then((data: CautionaryAlertsResponse) => {
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

  const getPersonAlerts = (tenureId) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${tenureId}/person-alerts`,
    })
      .then((data: CautionaryAlertsResponse) => {
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
    boilerHouseId !== '' &&
    boilerHouseId !== null &&
    boilerHouseId !== undefined

  useEffect(() => {
    setLocationAlertsLoading(true)
    getLocationAlerts()

    if (tenure?.id) {
      setPersonAlertsLoading(true)
      getPersonAlerts(tenure.id)
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
        <TenureComponent tenure={tenure} canRaiseRepair={canRaiseRepair} />
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

export default PropertyFlags
