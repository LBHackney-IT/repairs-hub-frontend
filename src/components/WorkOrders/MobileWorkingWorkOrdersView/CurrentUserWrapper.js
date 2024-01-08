import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import MobileWorkingWorkOrdersView from './MobileWorkingWorkOrdersView'

const CurrentUserWrapper = () => {
  const [currentUser, setCurrentUser] = useState({})
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const getOperativeWorkOrderView = async () => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)
    } catch (e) {
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    getOperativeWorkOrderView()
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!!currentUser && (
            <MobileWorkingWorkOrdersView currentUser={currentUser} />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default CurrentUserWrapper
