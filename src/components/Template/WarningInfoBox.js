import PropTypes from 'prop-types'
import cn from 'classnames'

const WarningInfoBox = ({ header, text, name, className }) => {
  return (
    <div
      className={cn(
        'warning-info-box govuk-inset-text lbh-inset-text',
        className
      )}
      data-testid={name}
    >
      <div className="lbh-warning-text govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <div className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          <p className="govuk-!-margin-top-0 lbh-body-s lbh-!-font-weight-bold">
            {header}
          </p>
          <p className="lbh-body-xs govuk-!-margin-top-1">{text}</p>
        </div>
      </div>
    </div>
  )
}

WarningInfoBox.propTypes = {
  header: PropTypes.string.isRequired,
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default WarningInfoBox
