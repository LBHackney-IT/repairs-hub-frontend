import Search from '../components/Search/Search'
import JobView from '../components/WorkOrders/JobView'
import UserContext from '../components/UserContext/UserContext'
import { useContext } from 'react'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../utils/user'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)

  if (user.hasAgentPermissions) {
    if (Object.entries(query).length === 0) {
      return <Search />
    } else {
      return <Search query={query} />
    }
  } else {
    if (Object.entries(query).length === 0) {
      if (user.hasAuthorisationManagerPermissions) {
        // Default filter selected for Authorisation Pending Approval work orders
        return <JobView pageNumber={1} query={{ StatusCode: '1010' }} />
      } else if (user.hasContractorManagerPermissions) {
        // Default filter selected for Variation Pending Approval work orders
        return <JobView pageNumber={1} query={{ StatusCode: '90' }} />
      } else {
        return <JobView pageNumber={1} />
      }
    } else {
      return <JobView query={query} />
    }
  }
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
