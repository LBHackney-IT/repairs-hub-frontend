import RaiseRepairFormView from '../../../../components/Property/RaiseRepair/RaiseRepairFormView'

import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../../../../utils/user'

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

RaiseRepairPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default RaiseRepairPage
