import PropTypes from 'prop-types'
import { redirectToHome, isAuthorised } from '../utils/GoogleAuth'
import { getProtocol } from '../utils/urls'
import UserLogin from '../components/UserLogin/UserLogin'

const LoginPage = ({ gssoUrl, returnUrl }) => {
  return <UserLogin submitText="Login" gssoUrl={`${gssoUrl}${returnUrl}`} />
}

LoginPage.propTypes = {
  gssoUrl: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
}

export const getServerSideProps = async (ctx) => {
  const { GSSO_URL } = process.env
  const protocol = getProtocol()
  const { REDIRECT_URL } = process.env
  const host = REDIRECT_URL

  const user = isAuthorised(ctx)

  if (user && user.isAuthorised) {
    console.log(ctx.res)
    redirectToHome(ctx.res)
  }

  return {
    props: {
      gssoUrl: GSSO_URL,
      returnUrl: `${protocol}://${host}`,
    },
  }
}

export default LoginPage
