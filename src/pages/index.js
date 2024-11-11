import { useRouter } from 'next/router'
import { useMemo } from 'react'

import Spinner from '@/components/Spinner'

import UserContext from '@/components/UserContext'
import { useContext, useEffect, useState } from 'react'
import { ALL_ROLES } from '@/utils/user'
import {
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
} from '@/utils/userPermissions'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import Search from '../components/Search/Search'
import CurrentUserWrapper from '../components/WorkOrders/CurrentUserWrapper'
import MobileWorkingWorkOrdersView from '../components/WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'
import WorkOrdersView from '@/components/WorkOrders/WorkOrdersView'
import NewTabs from '../components/NewTabs/Index'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const titles = ['Current Work Orders', 'Past Work Orders']

  const handleTabClick = (index) => {
    index === 1 && router.push('/oldjobs')
  }

  const ariaSelected = useMemo(() => {
    return router.pathname === '/oldjobs' ? 1 : 0
  }, [router.pathname])

  const HomeView = () => {
    if (user && canSeeWorkOrders(user)) {
      // Use saved filter preset in local storage as the default applied filters (if present)
      const defaultFilters = JSON.parse(
        localStorage.getItem('RH - default work order filters')
      )
      if (Object.entries(query).length === 0) {
        return (
          <>
            <WorkOrdersView
              pageNumber={1}
              {...(defaultFilters && { query: defaultFilters })}
            />
          </>
        )
      } else {
        return (
          <>
            <WorkOrdersView query={query} />
          </>
        )
      }
    } else if (user && canSeeOperativeWorkOrders(user)) {
      return (
        <>
          <NewTabs
            titles={titles}
            onTabChange={handleTabClick}
            ariaSelected={ariaSelected}
          />
          <CurrentUserWrapper>
            {({ currentUser }) => (
              <MobileWorkingWorkOrdersView currentUser={currentUser} />
            )}
          </CurrentUserWrapper>
        </>
      )
    } else {
      if (Object.entries(query).length === 0) {
        return <Search />
      } else {
        return <Search query={query} />
      }
    }
  }

  useEffect(() => {
    // Window object is required to access localStorage
    if (typeof window !== 'undefined') {
      setLoading(false)
    }
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <HomeView />
        </>
      )}
    </>
  )
}

export const getServerSideProps = getQueryProps

Home.permittedRoles = [...ALL_ROLES]

export default Home
