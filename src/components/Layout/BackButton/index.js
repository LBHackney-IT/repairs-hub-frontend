import Router from 'next/router'

const BackButton = ({ onClick = null }) => (
  <a
    className="govuk-back-link lbh-back-link govuk-!-display-none-print"
    role="button"
    onClick={onClick === null ? () => Router.back() : onClick}
  >
    Back
  </a>
)

export default BackButton
