import { redirectToHome, isAuthorised } from '@/utils/auth/authSession'
import AccessDenied from '@/components/AccessDenied'
import Meta from '@/components/Meta'

const AccessDeniedPage = () => (
  <>
    <Meta title="Access Denied" />
    <AccessDenied></AccessDenied>
  </>
)

export const getServerSideProps = async (ctx) => {
  const user = await isAuthorised(ctx)
  if (!user || !user.hasAnyPermissions) {
    redirectToHome(ctx.res)
  }
  return {
    props: {},
  }
}

export default AccessDeniedPage
