import Search from '@/components/Search/Search'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/auth/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

const SearchPage = ({ query }) => {
  if (Object.entries(query).length === 0) {
    return <Search />
  } else {
    return <Search query={query} />
  }
}

export const getServerSideProps = getQueryProps

SearchPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default SearchPage
