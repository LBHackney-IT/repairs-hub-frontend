import { useEffect, useState } from 'react'

import Spinner from '@/components/Spinner'
import HomeView from '@/components/Home/HomeView'
import { ALL_ROLES } from '@/utils/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

const Home = ({ query }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Window object is required to access localStorage
    if (typeof window !== 'undefined') {
      setLoading(false)
    }
  }, [])

  return loading ? <Spinner /> : <HomeView query={query} />
}

export const getServerSideProps = getQueryProps

Home.permittedRoles = [...ALL_ROLES]

export default Home
