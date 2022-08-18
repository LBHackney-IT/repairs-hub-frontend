import PropTypes from 'prop-types'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Alerts from './Alerts'
import Tenure from './Tenure'
import TenureDetail from './TenureDetail'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'

const TenureDetails = ({
  canRaiseRepair,
  tenure,
  tmoName,
  propertyReference,
  setParentCautionaryAlerts,
}) => {
  //Properties with TMO names set to this value aren't actually TMOs
  const TMO_HACKNEY_DEFAULT = 'London Borough of Hackney'

  const [cautionaryAlerts, setCautionaryAlerts] = useState([])
  const [cautionaryAlertsLoading, setCautionaryAlertsLoading] = useState(false)
  const [cautionaryAlertsError, setCautionaryAlertsError] = useState()


  const getCautionaryAlerts = () => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/location-alerts`,
    })
      .then((data) => {
        setCautionaryAlerts(data.alerts)
        setParentCautionaryAlerts && setParentCautionaryAlerts(data.alerts)
      })
      .catch((error) => {
        console.error('Error loading cautionary alerts status:', error.response)

        setCautionaryAlertsError(
          `Error loading cautionary alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setCautionaryAlertsLoading(false))
  }

  const renderCautionaryAlerts = () =>
    cautionaryAlerts.length > 0 && (
      <Alerts alerts={cautionaryAlerts} alertType="Address" />
    )

  useEffect(() => {
    setCautionaryAlertsLoading(true)
    getCautionaryAlerts()
  }, [])

  return (
    <ul className="lbh-list hackney-property-alerts">
      {tenure && Object.keys(tenure).length > 0 && (
        <Tenure tenure={tenure} canRaiseRepair={canRaiseRepair} />
      )}

      {cautionaryAlertsLoading ? (
        <Spinner resource="cautionaryAlerts" />
      ) : (
        renderCautionaryAlerts()
      )}
      {cautionaryAlertsError && <ErrorMessage label={cautionaryAlertsError} />}

      {tmoName && tmoName !== TMO_HACKNEY_DEFAULT && (
        <TenureDetail text="TMO" detail={tmoName} />
      )}
    </ul>
  )
}

TenureDetails.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object,
  tmoName: PropTypes.string,
  propertyReference: PropTypes.string.isRequired,
  setParentCautionaryAlerts: PropTypes.func,
}

export default TenureDetails
