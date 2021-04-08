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
          <a className="govuk-link govuk-link--no-visited-state" href="/logout">
            Logout
          </a>
        )}
      </Header>
    </>
  )
}

HeaderComponent.propTypes = {
  serviceName: PropTypes.string.isRequired,
}

export default HeaderComponent
