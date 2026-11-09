import { redirectToLogin, checkAuthorisation } from '@/utils/auth/authSession'
import AccessDenied from '@/components/AccessDenied'
import Meta from '@/components/Meta'

const AccessDeniedPage = () => (
  <>
    <Meta title="Access Denied" />
    <AccessDenied/>
  </>
)

export const getServerSideProps = async (ctx) => {
  const { status } = await checkAuthorisation(ctx)

  // Only signed in users can be denied access. Everyone else needs to sign in.
  if (status === 'unauthenticated') {
    redirectToLogin(ctx.res)
  }
  return {
    props: {},
  }
}

export default AccessDeniedPage
