import { redirectToHome, isAuthorised } from '@/utils/googleAuth'
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
  const user = await isAuthorised(ctx)

  if (user && user.hasAnyPermissions) {
    redirectToHome(ctx.res)
  }

  return { props: {} }
}

export default LoginPage
