import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import OperativeFormView from '@/components/Operatives/OperativeFormView'
import PropTypes from 'prop-types'

import { OPERATIVE_ROLE } from '@/utils/user'

const EditWorkOrderOperativePage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Operatives for Work Order ${query.id}`} />

      <OperativeFormView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

EditWorkOrderOperativePage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

EditWorkOrderOperativePage.permittedRoles = [OPERATIVE_ROLE]

export default EditWorkOrderOperativePage
