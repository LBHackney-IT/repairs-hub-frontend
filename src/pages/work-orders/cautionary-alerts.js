import CautionaryAlertsView from '../../components/CautionaryAlerts/CautionaryAlertsView'
import { OPERATIVE_ROLE } from '../../utils/user'

const CautionaryAlertsPage = ({ query }) => {
  if (Object.entries(query).length === 0) {
    return <CautionaryAlertsView />
  } else {
    return <CautionaryAlertsView query={query} />
  }
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

CautionaryAlertsPage.permittedRoles = [OPERATIVE_ROLE]

export default CautionaryAlertsPage
