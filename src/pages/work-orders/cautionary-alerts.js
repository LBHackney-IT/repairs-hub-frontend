import CautionaryAlertsView from '@/components/CautionaryAlerts/CautionaryAlertsView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/root/src/utils/auth/user'

const CautionaryAlertsPage = ({ query }) => {
  if (Object.entries(query).length === 0) {
    return <CautionaryAlertsView />
  } else {
    return <CautionaryAlertsView query={query} />
  }
}

export const getServerSideProps = getQueryProps

CautionaryAlertsPage.permittedRoles = [OPERATIVE_ROLE]

export default CautionaryAlertsPage
