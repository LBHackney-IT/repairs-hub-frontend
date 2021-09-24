import CautionaryContactView from '../../components/CautionaryContact/CautionaryContactView'
import { OPERATIVE_ROLE } from '../../utils/user'

const CautionaryContactPage = ({ query }) => {
  return <CautionaryContactView cautContact={query.cautContact} />
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
