import Search from '../components/Search/Search'
import Spinner from '../components/Spinner/Spinner'
import WorkOrdersView from '../components/WorkOrders/WorkOrdersView'
import UserContext from '../components/UserContext/UserContext'
import { useContext, useEffect, useState } from 'react'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../models/user'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState(true)

  const HomeView = () => {
    if (
      user &&
      (user.hasContractorPermissions ||
        user.hasAuthorisationManagerPermissions ||
        user.hasContractManagerPermissions)
    ) {
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

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

Home.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default Home
