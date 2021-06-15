import PropTypes from 'prop-types'
import Alerts from './Alerts'
import Tenure from './Tenure'
import TmoName from './TmoName'

const TenureAlertDetails = ({
  canRaiseRepair,
  tenure,
  locationAlerts,
  personAlerts,
  tmoName,
}) => {
  if (
    (tenure && Object.keys(tenure).length > 0) ||
    locationAlerts.length > 0 ||
    personAlerts.length > 0 ||
    tmoName
  ) {
    return (
      <ul className="lbh-list hackney-property-alerts">
        <Tenure tenure={tenure} canRaiseRepair={canRaiseRepair} />
        <Alerts alerts={locationAlerts} alertType="Address" />
        <TmoName tmoName={tmoName} />
        <Alerts alerts={personAlerts} alertType="Contact" />
      </ul>
    )
  } else {
    return ''
  }
}

TenureAlertDetails.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tmoName: PropTypes.string,
}

export default TenureAlertDetails
