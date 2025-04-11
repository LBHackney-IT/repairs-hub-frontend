import Link from 'next/link'

const PhaseBanner = () => {
  return (
    <section className="lbh-announcement lbh-announcement--site govuk-!-display-none-print govuk-!-margin-0">
      <div className="lbh-container">
        {/* <h3 className="lbh-announcement__title">Site-wide announcement</h3> */}
        <div className="lbh-announcement__content">
          <p className="lbh-body-s">
            Follow on functionality in Repairs Hub!{' '}
            <Link
              className="lbh-link"
              href="/latest-changes"
            >
              Read more
            </Link>{' '}
            about these changes and provide your{' '}
            <a
              className="lbh-link"
              title="feedback"
              href="mailto:repairshub.feedback@hackney.gov.uk"
            >
              feedback
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

export default PhaseBanner
