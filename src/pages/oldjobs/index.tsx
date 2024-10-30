import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/utils/user'
import MobileWorkingPastWorkOrdersView from '../../components/PastWorkOrders/MobileWorkingPastWorkOrdersView/MobileWorkingPastWorkOrdersView'
import CurrentUserWrapper from '../../components/WorkOrders/CurrentUserWrapper'
import NewTabs from '../../components/NewTabs/Index'

const OperativePastWorkOrderPage = () => {
  // This page was created so users in operative and other groups
  // can access a work order via different links to take different actions.

  // We intentionally do nothing with the operativeId supplied in the query
  // Instead the API is relied upon to check operative work order access.
  return (
    <>
      <NewTabs />
      <Meta title={`Past Work Orders`} />
      <CurrentUserWrapper>
        {({ currentUser }) => (
          <MobileWorkingPastWorkOrdersView currentUser={currentUser} />
        )}
      </CurrentUserWrapper>
    </>
  )
}

export const getServerSideProps = getQueryProps

OperativePastWorkOrderPage.permittedRoles = [OPERATIVE_ROLE]

export default OperativePastWorkOrderPage
