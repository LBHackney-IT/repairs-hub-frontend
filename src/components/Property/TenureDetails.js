import PropTypes from 'prop-types'
import Alerts from './Alerts'
import Tenure from './Tenure'
import TenureDetail from './TenureDetail'

const TenureDetails = ({
  canRaiseRepair,
  tenure,
  locationAlerts,
  personAlerts,
  tmoName,
}) => {
  //Properties with TMO names set to this value aren't actually TMOs
  const TMO_HACKNEY_DEFAULT = 'London Borough of Hackney'

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
        {tmoName !== TMO_HACKNEY_DEFAULT && (
          <TenureDetail text="TMO" detail={tmoName} />
        )}
        <Alerts alerts={personAlerts} alertType="Contact" />
      </ul>
    )
  } else {
    return ''
  }
}

TenureDetails.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tmoName: PropTypes.string,
}

export default TenureDetails
