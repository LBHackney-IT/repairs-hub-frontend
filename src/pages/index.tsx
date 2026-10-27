import HomeView from '@/components/Home/HomeView'
import { ALL_ROLES } from '@/utils/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const Home = ({ query }: PageProps) => <HomeView query={query} />

export const getServerSideProps = getQueryProps

Home.permittedRoles = [...ALL_ROLES]

export default Home
