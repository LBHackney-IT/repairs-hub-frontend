import PropTypes from 'prop-types'

const PhaseBanner = ({ feedbackLink }) => {
  return (
    <section className="lbh-announcement lbh-announcement--site govuk-!-display-none-print govuk-!-margin-0">
      <div className="lbh-container">
        {/* <h3 className="lbh-announcement__title">Site-wide announcement</h3> */}
        <div className="lbh-announcement__content">
          <p className="lbh-body-s">
            You can now add photos to Repairs Hub!{' '}
            <a href={feedbackLink}>Read more</a> about these changes and provide
            your feedback.
          </p>
        </div>
      </div>
    </section>
  )
}

PhaseBanner.propTypes = {
  feedbackLink: PropTypes.string.isRequired,
}

export default PhaseBanner
