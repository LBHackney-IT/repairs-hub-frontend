import PropTypes from 'prop-types'

const PhaseBanner = ({ feedbackLink }) => {
  return (
    <div className="govuk-phase-banner lbh-phase-banner lbh-container govuk-!-display-none-print">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag lbh-tag">
          Beta
        </strong>
        <span className="govuk-phase-banner__text">
          This is a new service - your
          <span> </span>
          <a href={feedbackLink} title="feedback">
            feedback
          </a>{' '}
          will help us to improve it.
        </span>
      </p>
    </div>
  )
}

PhaseBanner.propTypes = {
  feedbackLink: PropTypes.string.isRequired,
}

export default PhaseBanner
