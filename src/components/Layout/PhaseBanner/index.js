import PropTypes from 'prop-types'

const PhaseBanner = ({ feedbackLink }) => {
  return (
    <div className="govuk-phase-banner lbh-phase-banner lbh-container govuk-!-display-none-print">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag lbh-tag">
          Beta
        </strong>
        <span className="govuk-phase-banner__text">
          This is our new website design - it's work in progress.
          <span> </span>
          <a href={feedbackLink} title="Tell us what you think">
            Tell us what you think
          </a>
          , your feedback will help us to improve it.
        </span>
      </p>
    </div>
  )
}

PhaseBanner.propTypes = {
  feedbackLink: PropTypes.string.isRequired,
}

export default PhaseBanner
