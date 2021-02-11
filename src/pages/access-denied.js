import { redirectToHome, isAuthorised } from '../utils/GoogleAuth'
import AccessDenied from '../components/AccessDenied'

const AccessDeniedPage = () => <AccessDenied></AccessDenied>

export const getServerSideProps = async (ctx) => {
  const user = isAuthorised(ctx)
  if (!user || !user.hasAnyPermissions) {
    redirectToHome(ctx.res)
  }
  return {
    props: {},
  }
}

export default AccessDeniedPage
