import PropTypes from 'prop-types'
import { Header } from 'lbh-frontend-react'

const HeaderComponent = ({ serviceName }) => (
  <div>
    <Header
      serviceName={serviceName}
      isServiceNameShort={false}
      homepageUrl="/"
    />

    <a href="/logout" className="govuk-link">
      Logout
    </a>
  </div>
)

HeaderComponent.propTypes = {
  serviceName: PropTypes.string.isRequired,
}

export default HeaderComponent
