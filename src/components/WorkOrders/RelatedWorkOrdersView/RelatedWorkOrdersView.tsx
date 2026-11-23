import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { WorkOrderHierarchy } from '@/models/workOrderHierarchy'
import RelatedWorkOrderViewList from './RelatedWorkOrderViewList'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'
import { fetchWorkOrderHierarchyRequest } from '@/requests/workOrders'

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
      const response = await fetchWorkOrderHierarchyRequest(workOrderReference)

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

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      {isLoading && <Spinner />}
      {error && <ErrorMessage label={error} />}
      {!isLoading && hierarchy && (
        <RelatedWorkOrderViewList hierarchy={hierarchy} />
      )}
    </>
  )
}

export default RelatedWorkOrdersView
