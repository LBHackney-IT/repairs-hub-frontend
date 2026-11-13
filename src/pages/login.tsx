import { redirectToHome, checkAuthorisation } from '@/utils/auth/authSession'
import UserLogin from '@/components/UserLogin'
import Meta from '@/components/Meta'

const LoginPage = () => (
  <>
    <Meta title="Sign in" />
    <UserLogin />
  </>
)

export const getServerSideProps = async (ctx) => {
  const { status } = await checkAuthorisation(ctx)

  // Signed in already, so there's nothing to do here
  if (status === 'authorised') {
    redirectToHome(ctx.res)
  }

  return { props: {} }
}

export default LoginPage
