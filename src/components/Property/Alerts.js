import PropTypes from 'prop-types'

const Alerts = ({ alerts, alertType }) => {
  return (
    <>
      {alerts.map((alert, index) => {
        return (
          <li className="bg-orange" key={index}>
            {alertType} Alert: {alert.comments} (<strong>{alert.type}</strong>)
          </li>
        )
      })}
    </>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      comments: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    })
  ).isRequired,
}

export default Alerts
