import Search from '../../components/Search/Search'
import { AGENT_ROLE } from '../../utils/user'

const SearchPage = ({ query }) => {
  return <Search query={query} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

SearchPage.permittedRoles = [AGENT_ROLE]

export default SearchPage
