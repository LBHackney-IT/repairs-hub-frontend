import RaiseWorkOrderFormView from '@/components/Property/RaiseWorkOrder/RaiseWorkOrderFormView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/utils/user'

const RaiseRepairPage = ({ query }) => {
  return <RaiseWorkOrderFormView propertyReference={query.id} />
}

export const getServerSideProps = getQueryProps

RaiseRepairPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

RaiseRepairPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default RaiseRepairPage
