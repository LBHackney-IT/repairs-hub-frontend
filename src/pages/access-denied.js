import { redirectToHome, isAuthorised } from '../utils/GoogleAuth'

const AccessDenied = () => (
  <div>
    <h1>Access denied</h1>
  </div>
)

export const getServerSideProps = async (ctx) => {
  const user = isAuthorised(ctx)
  if (!user || !user.hasAnyPermissions) {
    redirectToHome(ctx.res)
  }
  return {
    props: {},
  }
}

export default AccessDenied
