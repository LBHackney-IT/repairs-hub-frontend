import { useRouter } from 'next/router'

import Spinner from '@/components/Spinner'

import UserContext from '@/components/UserContext'
import { useContext, useEffect, useState } from 'react'
import { ALL_ROLES } from '@/utils/user'
import {
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
} from '@/utils/userPermissions'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PastOrdersCurrentUserWrapper from '../components/PastWorkOrders/CurrentUserWrapper'
import CurrentUserWrapper from '../components/WorkOrders/CurrentUserWrapper'
import MobileWorkingPastWorkOrdersView from '../components/PastWorkOrders/MobileWorkingPastWorkOrdersView/MobileWorkingPastWorkOrdersView'
import MobileWorkingWorkOrdersView from '../components/WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'
import WorkOrdersView from '@/components/WorkOrders/WorkOrdersView'
import NewTabs from '../components/NewTabs/Index'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [workOrdersSelected, setWorkOrdersSelected] = useState(true)

  const titles = ['Current Work Orders', 'Past Work Orders']

  const handleTabClick = (index) => {
    setWorkOrdersSelected(false)
    index === 1 && router.push('/oldjobs')
  }

  const HomeView = () => {
    return (
      <>
        <NewTabs
          titles={titles}
          onTabChange={handleTabClick}
          workOrdersSelected={workOrdersSelected}
        />

        <CurrentUserWrapper>
          {({ currentUser }) => (
            <MobileWorkingWorkOrdersView currentUser={currentUser} />
          )}
        </CurrentUserWrapper>
      </>
    )
    // if (user && canSeeWorkOrders(user)) {
    //   // Use saved filter preset in local storage as the default applied filters (if present)
    //   const defaultFilters = JSON.parse(
    //     localStorage.getItem('RH - default work order filters')
    //   )
    //   if (Object.entries(query).length === 0) {
    //     return (
    //       <WorkOrdersView
    //         pageNumber={1}
    //         {...(defaultFilters && { query: defaultFilters })}
    //       />
    //     )
    //   } else {
    //     return <WorkOrdersView query={query} />
    //   }
    // } else if (user && canSeeOperativeWorkOrders(user)) {
    //   return <MobileWorkingWorkOrdersView />
    // } else {
    //   if (Object.entries(query).length === 0) {
    //     return <Search />
    //   } else {
    //     return <Search query={query} />
    //   }
    // }
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
