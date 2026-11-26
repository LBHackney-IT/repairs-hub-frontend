import WorkOrdersHistoryTable from './WorkOrdersHistoryTable'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import ErrorMessage from '../../Errors/ErrorMessage'
import { useWorkOrdersHistory } from '@/requests/hooks/useWorkOrdersHistory'

interface Props {
  tabName: string
  propertyReference: string
}

const WorkOrdersHistoryView = ({ propertyReference, tabName }: Props) => {
  const {
    workOrders,
    isLoading,
    error,
    hasMore,
    loadMore,
  } = useWorkOrdersHistory(propertyReference)

  if (isLoading) {
    return (
      <>
        <h2 className="lbh-heading-h2">{tabName}</h2>
        <div className="govuk-!-margin-top-6">
          <SpinnerWithLabel label="Fetching work orders history…" />
        </div>
      </>
    )
  }

  return (
    <>
      {workOrders.length > 0 && (
        <WorkOrdersHistoryTable
          workOrders={workOrders}
          tabName={tabName}
          propertyReference={propertyReference}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      )}

      {workOrders.length === 0 && !error && (
        <>
          <h2 className="lbh-heading-h2">{tabName}</h2>
          <div>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <h4 className="lbh-heading-h4">
              There are no historical repairs for this property.
            </h4>
          </div>
        </>
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default WorkOrdersHistoryView
