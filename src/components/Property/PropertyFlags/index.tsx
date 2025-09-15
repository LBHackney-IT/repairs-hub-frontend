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
  setParentAlerts?: (alerts: CautionaryAlert[]) => void
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
    setParentAlerts,
  } = props

  const [alerts, setAlerts] = useState<CautionaryAlert[]>([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [alertsError, setAlertsError] = useState<string | null>()

  const getAlerts = () => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/alerts`,
    })
      .then((data: CautionaryAlertsResponse) => {
        setAlerts(data.alerts)
        setParentAlerts && setParentAlerts(data.alerts)
      })
      .catch((error) => {
        console.error('Error loading alerts status:', error.response)

        setAlertsError(
          `Error loading alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setAlertsLoading(false))
  }

  const renderAlerts = () => alerts.length > 0 && <Alerts alerts={alerts} />

  const showBoilerHouseDetails = () =>
    boilerHouseId !== '' &&
    boilerHouseId !== null &&
    boilerHouseId !== undefined

  useEffect(() => {
    setAlertsLoading(true)
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

      {alertsLoading ? <Spinner resource="alerts" /> : renderAlerts()}

      {alertsError && <ErrorMessage label={alertsError} />}

      {tmoName && tmoName !== TMO_HACKNEY_DEFAULT && (
        <TenureDetail text="TMO" detail={tmoName} />
      )}
    </ul>
  )
}

export default PropertyFlags
