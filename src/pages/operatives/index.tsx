import CurrentUserWrapper from '../../components/PastWorkOrders/CurrentUserWrapper/Index'
// import MobileWorkingPastWorkOrdersView from '../../components/PastWorkOrders/MobileWorkingPastWorkOrdersView/MobileWorkingPastWorkOrdersView'

import MobileWorkingWorkOrdersView from '../../components/WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import { DATA_ADMIN_ROLE, OPERATIVE_ROLE } from '../../utils/user'

const OperativeHomePage = ({ query }) => {
  return (
    <>
      <CurrentUserWrapper>
        {({ currentUser }) => (
          <MobileWorkingWorkOrdersView currentUser={currentUser} />
        )}
      </CurrentUserWrapper>
    </>
  )
}

export const getServerSideProps = getQueryProps

OperativeHomePage.permittedRoles = [OPERATIVE_ROLE, DATA_ADMIN_ROLE]

export default OperativeHomePage
