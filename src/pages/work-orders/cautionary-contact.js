import CautionaryContactView from '../../components/CautionaryContact/CautionaryContactView'
import { OPERATIVE_ROLE } from '../../utils/user'

const CautionaryContactPage = ({ query }) => {
  if (Object.entries(query).length === 0) {
    return <CautionaryContactView />
  } else {
    return <CautionaryContactView query={query} />
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

CautionaryContactPage.permittedRoles = [OPERATIVE_ROLE]

export default CautionaryContactPage
