import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import MobileWorkingLayout from './MobileWorkingLayout'

export const MobileWorkingWorkOrdersView = () => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(async () => {
    const currentUser = await frontEndApiRequest({
      method: 'get',
      path: '/api/hub-user',
    })

    setCurrentUser(currentUser)
  }, [])

  if (!currentUser) return <Spinner />

  return <MobileWorkingLayout currentUser={currentUser} />
}

export default MobileWorkingWorkOrdersView
