import RaiseRepairFormView from '../../../../components/Property/RaiseRepair/RaiseRepairFormView'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../../../../utils/user'

const RaiseRepairPage = ({ query }) => {
  return <RaiseRepairFormView propertyReference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

RaiseRepairPage.permittedRoles = [AGENT_ROLE, CONTRACTOR_ROLE]

export default RaiseRepairPage
