import { useContext } from 'react'

import UserContext from '@/components/UserContext'
import {
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
} from '@/utils/userPermissions'
import type { PageProps } from '@/types/page'
import Search from '../Search/Search'
import CurrentUserWrapper from '../WorkOrders/CurrentUserWrapper'
import MobileWorkingWorkOrdersView from '../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'
import WorkOrdersView from '@/components/WorkOrders/WorkOrdersView'

const HomeView = ({ query }: PageProps) => {
  const { user } = useContext(UserContext)

  const hasQuery = Object.entries(query).length > 0

  if (user && canSeeWorkOrders(user)) {
    return <WorkOrdersView query={query} />
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
