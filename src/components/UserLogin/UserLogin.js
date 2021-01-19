import PropTypes from 'prop-types'

const UserLogin = ({ gssoUrl, submitText }) => {
  return (
    <div>
      <section className="section">
        <h1 className="govuk-heading-m">Login</h1>

        <p className="govuk-body">
          Please log in with your Hackney email account.
        </p>

        <a className="govuk-link" href={gssoUrl}>
          <button className="govuk-button">{submitText}</button>
        </a>
      </section>
    </div>
  )
}

UserLogin.propTypes = {
  gssoUrl: PropTypes.string.isRequired,
  submitText: PropTypes.string.isRequired,
}

export default UserLogin
