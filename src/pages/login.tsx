import { redirectToHome, checkAuthorisation } from '@/utils/auth/authSession'
import UserLogin from '@/components/UserLogin'
import Meta from '@/components/Meta'
import { signIn } from 'next-auth/react'

const LoginPage = () => {
  return (
    <>
      <Meta title="Sign in" />
      <UserLogin
        submitText="Sign in with Google"
        onSignIn={() => signIn('cognito', { callbackUrl: '/' })}
      />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { status } = await checkAuthorisation(ctx)

  // Signed in already, so there's nothing to do here
  if (status === 'authorised') {
    redirectToHome(ctx.res)
  }

  return { props: {} }
}

export default LoginPage
