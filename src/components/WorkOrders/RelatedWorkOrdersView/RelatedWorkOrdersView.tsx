import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrderHierarchy } from './types'
import RelatedWorkOrderViewList from './RelatedWorkOrderViewList'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

interface Props {
  tabName: string
  workOrderReference: string
}

const RelatedWorkOrdersView = ({ workOrderReference, tabName }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hierarchy, setHierarchy] = useState<WorkOrderHierarchy | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchHierarchy = async () => {
    setIsLoading(true)

    setError(null)
    setHierarchy(null)

    try {
      const response: WorkOrderHierarchy = await frontEndApiRequest({
        path: `/api/workOrders/${workOrderReference}/hierarchy`,
        method: 'get',
      })

      setHierarchy(response)
    } catch (e) {
      setHierarchy(null)
      console.error('An error has occured:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchHierarchy()
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage label={error} />
  }

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      {hierarchy && <RelatedWorkOrderViewList hierarchy={hierarchy} />}
    </>
  )
}

export default RelatedWorkOrdersView
