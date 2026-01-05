import PropTypes from 'prop-types'
import Link from 'next/link'

const UserLogin = ({ gssoUrl, submitText }) => {
  return (
    <>
      <section className="section">
        <h1 className="lbh-heading-h1">Sign in</h1>
        <a
          href={gssoUrl}
          className="govuk-button lbh-button lbh-button--start govuk-button--start"
        >
          {submitText}
          <svg
            className="govuk-button__start-icon lbh-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            role="presentation"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </a>

        <p className="lbh-body">
          Please sign in with your Hackney email account.
        </p>

        <p className="lbh-body">
          Please contact your manager if you have issues signing in.
        </p>

        <p className="lbh-body support-link">
          If you have any issues with Repairs Hub, check our{' '}
          <Link href={process.env.NEXT_PUBLIC_SUPPORT_LINK} legacyBehavior>
            <a title="support-page" target="_blank">
              Support page.
            </a>
          </Link>{' '}
        </p>
      </section>
    </>
  )
}

UserLogin.propTypes = {
  gssoUrl: PropTypes.string.isRequired,
  submitText: PropTypes.string.isRequired,
}

export default UserLogin
