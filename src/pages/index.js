import Search from '@/components/Search/Search'
import Spinner from '@/components/Spinner'
import WorkOrdersView from '@/components/WorkOrders/WorkOrdersView'
import MobileWorkingWorkOrdersView from '@/components/WorkOrders/MobileWorkingWorkOrdersView'
import UserContext from '@/components/UserContext'
import { useContext, useEffect, useState } from 'react'
import { ALL_ROLES } from '@/utils/user'
import {
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
} from '@/utils/userPermissions'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState(true)

  const HomeView = () => {
    if (user && canSeeWorkOrders(user)) {
      // Use saved filter preset in local storage as the default applied filters (if present)
      const defaultFilters = JSON.parse(
        localStorage.getItem('RH - default work order filters')
      )

      if (Object.entries(query).length === 0) {
        return (
          <WorkOrdersView
            pageNumber={1}
            {...(defaultFilters && { query: defaultFilters })}
          />
        )
      } else {
        return <WorkOrdersView query={query} />
      }
    } else if (user && canSeeOperativeWorkOrders(user)) {
      return <MobileWorkingWorkOrdersView />
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

Home.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

Home.permittedRoles = [...ALL_ROLES]

export default Home
