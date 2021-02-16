import ChooseOption from '../../../../components/WorkOrders/ChooseOption'
import { CONTRACTOR_ROLE } from '../../../../utils/user'

const ChooseJobOptionPage = ({ query }) => {
  return <ChooseOption reference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

ChooseJobOptionPage.permittedRoles = [CONTRACTOR_ROLE]

export default ChooseJobOptionPage
