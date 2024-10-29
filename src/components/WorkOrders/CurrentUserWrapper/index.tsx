import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'

// Define the shape of the current user
interface CurrentUser {
  // Add your user properties here
  // For example:
  id: string
  name: string
  // ... other user properties
}

// Define props interface for child components
interface WithCurrentUserProps {
  currentUser: CurrentUser
}

interface Props {
  children: (props: WithCurrentUserProps) => React.ReactNode
}

const CurrentUserWrapper = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState(null)
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
      console.log(currentUser)
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
          {!!currentUser &&
            children({ currentUser })
            // <MobileWorkingWorkOrdersView currentUser={currentUser} />
          }
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default CurrentUserWrapper
