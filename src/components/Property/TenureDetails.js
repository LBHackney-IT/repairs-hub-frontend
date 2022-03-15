import PropTypes from 'prop-types'
import Tenure from './Tenure'
import TenureDetail from './TenureDetail'

const TenureDetails = ({ canRaiseRepair, tenure, tmoName }) => {
  //Properties with TMO names set to this value aren't actually TMOs
  const TMO_HACKNEY_DEFAULT = 'London Borough of Hackney'

  if ((tenure && Object.keys(tenure).length > 0) || tmoName) {
    return (
      <ul className="lbh-list hackney-property-alerts">
        <Tenure tenure={tenure} canRaiseRepair={canRaiseRepair} />

        {tmoName !== TMO_HACKNEY_DEFAULT && (
          <TenureDetail text="TMO" detail={tmoName} />
        )}
      </ul>
    )
  } else {
    return ''
  }
}

TenureDetails.propTypes = {
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object,
  tmoName: PropTypes.string,
}

export default TenureDetails
