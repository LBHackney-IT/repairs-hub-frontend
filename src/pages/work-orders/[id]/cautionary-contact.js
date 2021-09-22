import CautionaryContactsView from '../../../components/Operatives/CautionaryContactsView'
import { OPERATIVE_ROLE } from '../../../utils/user'

const CautionaryContactPage = () => {
  return <CautionaryContactsView />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}
CautionaryContactPage.permittedRoles = [OPERATIVE_ROLE]

export default CautionaryContactPage
