import PropTypes from 'prop-types'

const LocationAlerts = ({ locationAlerts }) => {
  let alertsToShow = (lctAlerts) => {
    if (lctAlerts.length != 0) {
      let alertsHtml = lctAlerts.map((alert, index) => {
        return (
          <li className="bg-orange" key={index}>
            Address Alert: {alert.comments} (<strong>{alert.type}</strong>)
          </li>
        )
      })

      return <>{alertsHtml}</>
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
