import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

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

// Define props interface for child components
interface WithCurrentUserProps {
  currentUser: CurrentUser
}

interface Props {
  children: (props: WithCurrentUserProps) => React.ReactNode
}

const PastOrdersCurrentUserWrapper = ({ children }: Props) => {
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

export default PastOrdersCurrentUserWrapper
