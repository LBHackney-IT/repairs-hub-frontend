import Search from '../components/Search/Search'
import Spinner from '../components/Spinner/Spinner'
import WorkOrdersView from '../components/WorkOrders/WorkOrdersView'
import UserContext from '../components/UserContext/UserContext'
import { getCurrentUser } from '../utils/frontend-api-client/hub-user'
import { useContext, useEffect, useState } from 'react'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../utils/user'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [contractors, setContractors] = useState()

  const getContractors = async () => {
    setError(null)

    try {
      const data = await getCurrentUser()
      setContractors(data.contractors)
    } catch (e) {
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const HomeView = ({ contractors }) => {
    if (user.hasAgentPermissions) {
      if (user.hasContractorPermissions) {
        if (Object.entries(query).length === 0) {
          return (
            <WorkOrdersView
              pageNumber={1}
              query={{ ContractorReference: contractors }}
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
    } else {
      if (Object.entries(query).length === 0) {
        if (user.hasAuthorisationManagerPermissions) {
          // Default filter selected for Authorisation Pending Approval work orders
          return (
            <WorkOrdersView pageNumber={1} query={{ StatusCode: '1010' }} />
          )
        } else if (user.hasContractManagerPermissions) {
          // Default filter selected for Variation Pending Approval work orders
          return <WorkOrdersView pageNumber={1} query={{ StatusCode: '90' }} />
        } else {
          return <WorkOrdersView pageNumber={1} />
        }
      } else {
        return <WorkOrdersView query={query} />
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    setContractors(null)

    getContractors()
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {contractors && <HomeView contractors={contractors} />}
          {error && <ErrorMessage label={error} />}
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
