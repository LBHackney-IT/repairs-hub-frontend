import Spinner from '@/components/Spinner'
import { useEffect, useState } from 'react'
import { ALL_ROLES } from '@/utils/user'
import {
  canSeeWorkOrders,
  canSeeOperativeWorkOrders,
} from '@/utils/userPermissions'
import WorkOrdersView from '@/components/WorkOrders/WorkOrdersView'
import { isAuthorised } from '../utils/googleAuth'

const Home = ({ query }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Window object is required to access localStorage
    if (typeof window !== 'undefined') {
      setLoading(false)
    }
  }, [])

  if (loading) return <Spinner />

  // Use saved filter preset in local storage as the default applied filters (if present)
  const defaultFilters = JSON.parse(
    localStorage.getItem('RH - default work order filters')
  )

  const HomeView = () => {
    // directly rendering this breaks the component
    // feel free to fix it

    return (
      <WorkOrdersView
        query={query}
        {...(defaultFilters && { query: defaultFilters })}
      />
    )
  }

  return <HomeView />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  const isClientSideTransition = ctx.req.url.match('^/_next/data')

  const user = isAuthorised(ctx, !isClientSideTransition)

  console.log({ user })

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  if (canSeeWorkOrders(user)) {
    return {
      props: {
        query,
      },
    }
  }

  if (canSeeOperativeWorkOrders(user)) {
    return {
      redirect: {
        destination: '/operatives',
        permanent: false,
      },
    }
  }

  // default redirect to search
  return {
    redirect: {
      destination: '/search',
      permanent: false,
    },
  }
}

Home.permittedRoles = [...ALL_ROLES]

export default Home
