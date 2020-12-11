import PropTypes from 'prop-types'

const LocationAlerts = ({ locationAlerts }) => {
  let alertsToShow = (lctAlerts) => {
    if (lctAlerts.length != 0) {
      let alertsHtml = lctAlerts.map((alert, index) => {
        return (
          <li key={index}>
            {alert.comments} (
            <span className="govuk-!-font-weight-bold">{alert.code}</span>)
          </li>
        )
      })

      return (
        <ul className="govuk-tag bg-orange">Address alerts: {alertsHtml}</ul>
      )
    } else {
      return ''
    }
  }

  return <>{alertsToShow(locationAlerts)}</>
}

LocationAlerts.propTypes = {
  locationAlerts: PropTypes.array.isRequired,
}

export default LocationAlerts
