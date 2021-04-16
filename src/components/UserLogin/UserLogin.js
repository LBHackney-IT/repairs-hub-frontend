import PropTypes from 'prop-types'
import { Button } from '../Form'

const UserLogin = ({ gssoUrl, submitText }) => {
  return (
    <div>
      <section className="section">
        <h1 className="lbh-heading-h2">Login</h1>

        <p className="govuk-body">
          Please log in with an approved Hackney email account.
        </p>

        <a className="" href={gssoUrl}>
          <Button label={submitText} />
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
