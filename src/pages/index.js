import Search from '../components/Search/Search'
import JobView from '../components/WorkOrders/JobView'
import UserContext from '../components/UserContext/UserContext'
import { useContext } from 'react'

const Home = ({ query }) => {
  const { user } = useContext(UserContext)

  if (user.hasContractorPermissions) {
    if (Object.entries(query).length === 0) {
      return <JobView pageNumber={1} />
    } else {
      return <JobView pageNumber={parseInt(query.pageNumber)} />
    }
  } else {
    if (Object.entries(query).length === 0) {
      return <Search />
    } else {
      return <Search query={query} />
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

export default Home
