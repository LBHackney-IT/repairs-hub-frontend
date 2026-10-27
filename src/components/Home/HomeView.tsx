import { useContext, useEffect, useState } from 'react'

import Spinner from '@/components/Spinner'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Window object is required to access localStorage
    if (typeof window !== 'undefined') {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <Spinner />
  }

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
