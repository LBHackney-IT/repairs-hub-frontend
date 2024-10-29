import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import MobileWorkingPastWorkOrdersView from './MobileWorkingPastWorkOrdersView'

interface CurrentUser {
  sub: string
  name: string
  email: string
  varyLimit: string
  raiseLimit: string
  contractors: any[] // Adjust!
  operativePayrollNumber: string | null
  isOneJobAtATime: boolean
}

const CurrentUserWrapper = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [error, setError] = useState<string | null>()
  const [loading, setLoading] = useState(false)

  const getOperativeWorkOrderView = async () => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })
      console.log({ currentUser })
      currentUser.isOneJobAtATime = true
      currentUser.operativePayrollNumber = '016062'
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
            <MobileWorkingPastWorkOrdersView currentUser={currentUser} />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default CurrentUserWrapper
