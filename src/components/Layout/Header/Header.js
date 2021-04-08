import { useContext } from 'react'
import PropTypes from 'prop-types'
import { Header } from 'lbh-frontend-react'
import UserContext from '../../UserContext/UserContext'

const HeaderComponent = ({ serviceName }) => {
  const { user } = useContext(UserContext)

  return (
    <>
      <Header
        serviceName={serviceName}
        isServiceNameShort={false}
        homepageUrl="/"
      >
        {user && (
          <>
            {!user.hasAgentPermissions && (
              <a className="govuk-link govuk-link--no-visited-state" href="/">
                Manage jobs
              </a>
            )}
            <a
              className="govuk-link govuk-link--no-visited-state"
              href="/search"
            >
              Search
            </a>
            <a
              className="govuk-link govuk-link--no-visited-state"
              href="/logout"
            >
              Logout
            </a>
          </>
        )}
      </Header>
    </>
  )
}

HeaderComponent.propTypes = {
  serviceName: PropTypes.string.isRequired,
}

export default HeaderComponent
