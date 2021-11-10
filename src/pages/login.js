import PropTypes from 'prop-types'
import { redirectToHome, isAuthorised } from '@/utils/googleAuth'
import { getProtocol } from '@/utils/urls'
import UserLogin from '@/components/UserLogin'
import Meta from '@/components/Meta'

const LoginPage = ({ gssoUrl, returnUrl }) => {
  return (
    <>
      <Meta title="Sign in" />
      <UserLogin
        submitText="Sign in with Google"
        gssoUrl={`${gssoUrl}${returnUrl}`}
      />
    </>
  )
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

  if (user && user.hasAnyPermissions) {
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
