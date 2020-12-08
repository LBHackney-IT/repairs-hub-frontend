import PropTypes from 'prop-types'

const AddressAlerts = ({ cautionaryAlerts }) => {
  let alertsToShow = (adrAlerts) => {
    if (adrAlerts.length != 0) {
      let alertsHtml = adrAlerts.map((alert, index) => {
        return (
          <li key={index}>
            {alert.description} (
            <span className="govuk-!-font-weight-bold">{alert.alertCode}</span>)
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

  return (
    <>
      <div className="hackney-property-alerts">
        {alertsToShow(cautionaryAlerts)}
      </div>
    </>
  )
}

AddressAlerts.propTypes = {
  cautionaryAlerts: PropTypes.array.isRequired,
}

export default AddressAlerts
