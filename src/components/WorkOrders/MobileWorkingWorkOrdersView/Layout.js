import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'

const Layout = () => {
  const [currentUser, setCurrentUser] = useState({})
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const getOperative = async () => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)
    } catch (e) {
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    getOperative()
  }, [])

  return (
    <>
      <Meta title="Manage work orders" />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <MobileWorkingWorkOrdersView currentUser={currentUser} />
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default Layout
