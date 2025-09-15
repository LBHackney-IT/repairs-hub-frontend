import PropTypes from 'prop-types'
import TruncateText from '../Layout/TruncateText'

const Alerts = ({ alerts, setIsExpanded, isExpanded }) => {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
          <li
            className="bg-orange"
            style={{
              padding: '0.5rem',
              overflow: 'hidden',
              borderRadius: '10px',
            }}
            key={index}
          >
            <p style={{ marginTop: 0 }}>
              {alert.comments} <strong>{alert.type}</strong>
            </p>
            {alert.comments === 'Specific Requirements' && (
              <TruncateText
                text={alert.reason}
                numberOfLines="3"
                pTagClassName="lbh-body-s text-!-white"
                linkClassName="lbh-body-xs text-!-white"
                setIsExpanded={setIsExpanded}
                isExpanded={isExpanded}
              />
            )}
          </li>
        )
      })}
    </>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      comments: PropTypes.string,
      reason: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      alertId: PropTypes.string,
    })
  ).isRequired,
  setIsExpanded: PropTypes.fun,
  isExpanded: PropTypes.bool,
}

export default Alerts
