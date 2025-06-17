import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { CurrentUser } from '@/root/src/types/variations/types'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

// Define props interface for child components
interface WithCurrentUserProps {
  currentUser: CurrentUser
}

interface Props {
  children: (props: WithCurrentUserProps) => React.ReactNode
}

const CurrentUserWrapper = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [error, setError] = useState<string>()
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
      setError(formatRequestErrorMessage(e))
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
          {!!currentUser && children({ currentUser })}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default CurrentUserWrapper
