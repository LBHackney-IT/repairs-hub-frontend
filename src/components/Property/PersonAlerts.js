import PropTypes from 'prop-types'

const PersonAlerts = ({ personAlerts }) => {
  let alertsToShow = (prsnAlerts) => {
    if (prsnAlerts.length != 0) {
      let alertsHtml = prsnAlerts.map((alert, index) => {
        return (
          <li className="bg-orange" key={index}>
            Contact Alert: {alert.comments} (<strong>{alert.type}</strong>)
          </li>
        )
      })

      return <>{alertsHtml}</>
    } else {
      return ''
    }
  }

  return <>{alertsToShow(personAlerts)}</>
}

PersonAlerts.propTypes = {
  personAlerts: PropTypes.array.isRequired,
}

export default PersonAlerts
