import { redirectToHome, isAuthorised } from '../utils/googleAuth'
import AccessDenied from '../components/AccessDenied'
import Meta from '../components/Meta'

const AccessDeniedPage = () => (
  <>
    <Meta title="Access Denied" />
    <AccessDenied></AccessDenied>
  </>
)

export const getServerSideProps = async (ctx) => {
  const user = isAuthorised(ctx)
  if (!user || !user.hasAnyPermissions()) {
    redirectToHome(ctx.res)
  }
  return {
    props: {},
  }
}

export default AccessDeniedPage
