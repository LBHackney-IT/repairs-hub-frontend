import Search from '../components/Search/Search'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../utils/user'

const SearchPage = ({ query }) => {
  if (Object.entries(query).length === 0) {
    return <Search />
  } else {
    return <Search query={query} />
  }
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

SearchPage.permittedRoles = [AGENT_ROLE, CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default SearchPage
