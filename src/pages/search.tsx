import Search from '@/components/Search/Search'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/utils/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const SearchPage = ({ query }: PageProps) => <Search query={query} />

export const getServerSideProps = getQueryProps

SearchPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default SearchPage
