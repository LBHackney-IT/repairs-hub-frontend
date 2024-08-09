import BackButton from '../../Layout/BackButton'
import PropTypes from 'prop-types'

const Layout = ({ children, title }) => {
  return (
    <>
      <BackButton />

      <h1 className="lbh-heading-h1">{title}</h1>
      <>{children}</>
    </>
  )
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Layout
