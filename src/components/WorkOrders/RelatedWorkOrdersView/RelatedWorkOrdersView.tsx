import { useState, useEffect } from 'react'
import SpinnerWithLabel from '../../SpinnerWithLabel'
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
      {isLoading && (
        <div className="govuk-!-margin-top-6">
          <SpinnerWithLabel label="Fetching related work orders…" />
        </div>
      )}
      {error && <ErrorMessage label={error} />}
      {!isLoading && hierarchy && (
        <RelatedWorkOrderViewList hierarchy={hierarchy} />
      )}
    </>
  )
}

export default RelatedWorkOrdersView
