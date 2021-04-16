import PropTypes from 'prop-types'

const WarningText = ({ text }) => {
  return (
    <div className="govuk-warning-text lbh-warning-text">
      <span className="govuk-warning-text__icon" aria-hidden="true">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-warning-text__assistive">Warning</span>
        {text}
      </strong>
    </div>
  )
}

WarningText.propTypes = {
  text: PropTypes.string.isRequired,
}

export default WarningText
