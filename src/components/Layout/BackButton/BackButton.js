import Router from 'next/router'

const BackButton = () => (
  <a
    className="govuk-back-link lbh-back-link govuk-!-display-none-print"
    role="button"
    onClick={() => Router.back()}
  >
    Back
  </a>
)

export default BackButton
