import PropTypes from 'prop-types'
import Alerts from './Alerts'
import Tenure from './Tenure'

const TenureAlertDetails = ({
  canRaiseRepair,
  tenure,
  locationAlerts,
  personAlerts,
}) => {
  if (
    (tenure && Object.keys(tenure).length > 0) ||
    locationAlerts.length > 0 ||
    personAlerts.length > 0
  ) {
    return (
      <ul className="hackney-property-alerts">
        <Tenure tenure={tenure} canRaiseRepair={canRaiseRepair} />
        <Alerts alerts={locationAlerts} alertType="Address" />
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
}

export default TenureAlertDetails
