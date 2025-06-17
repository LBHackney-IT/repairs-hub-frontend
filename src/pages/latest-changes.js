import LatestChangesView from '../components/LatestChanges'
import { getQueryProps } from '../utils/helpers/serverSideProps'
import { ALL_ROLES } from '../auth/user'

const LatestChangesPage = () => {
  return <LatestChangesView />
}

export const getServerSideProps = getQueryProps

LatestChangesPage.permittedRoles = [...ALL_ROLES]

export default LatestChangesPage
