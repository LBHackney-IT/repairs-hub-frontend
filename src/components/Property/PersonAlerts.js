import PropTypes from 'prop-types'

const PersonAlerts = ({ personAlerts }) => {
  let alertsToShow = (prsnAlerts) => {
    if (prsnAlerts.length != 0) {
      let alertsHtml = prsnAlerts.map((alert, index) => {
        return (
          <li key={index}>
            {alert.comments} (
            <span className="govuk-!-font-weight-bold">{alert.code}</span>)
          </li>
        )
      })

      return (
        <ul className="govuk-tag bg-orange">Person alerts: {alertsHtml}</ul>
      )
    } else {
      return ''
    }
  }

  return (
    <>
      <div className="hackney-property-alerts">
        {alertsToShow(personAlerts)}
      </div>
    </>
  )
}

PersonAlerts.propTypes = {
  personAlerts: PropTypes.array.isRequired,
}

export default PersonAlerts
