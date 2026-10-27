import { useContext } from 'react'

import UserContext from '@/components/UserContext'
import {
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
} from '@/utils/userPermissions'
import Search from '../Search/Search'
import CurrentUserWrapper from '../WorkOrders/CurrentUserWrapper'
import MobileWorkingWorkOrdersView from '../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'
import WorkOrdersView from '@/components/WorkOrders/WorkOrdersView'

const HomeView = ({ query }) => {
  const { user } = useContext(UserContext)
  const hasQuery = Object.entries(query).length > 0

  if (user && canSeeWorkOrders(user)) {
    // Use saved filter preset in local storage as the default applied filters (if present)
    const defaultFilters = JSON.parse(
      localStorage.getItem('RH - default work order filters')
    )

    return hasQuery ? (
      <WorkOrdersView query={query} />
    ) : (
      <WorkOrdersView
        pageNumber={1}
        {...(defaultFilters && { query: defaultFilters })}
      />
    )
  }

  if (user && canSeeOperativeWorkOrders(user)) {
    return (
      <CurrentUserWrapper>
        {({ currentUser }) => (
          <MobileWorkingWorkOrdersView currentUser={currentUser} />
        )}
      </CurrentUserWrapper>
    )
  }

  return hasQuery ? <Search query={query} /> : <Search />
}

export default HomeView
