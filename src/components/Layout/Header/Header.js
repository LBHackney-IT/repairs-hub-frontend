import PropTypes from 'prop-types'
import { Header } from 'lbh-frontend-react'

const HeaderComponent = ({ serviceName }) => (
  <div>
    <Header
      serviceName={serviceName} isServiceNameShort={false} homepageUrl="/"
    />
  </div>
)

HeaderComponent.propTypes = {
  serviceName: PropTypes.string.isRequired
}

export default HeaderComponent
