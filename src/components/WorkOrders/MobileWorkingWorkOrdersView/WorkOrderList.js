import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem'
import WarningInfoBox from '../../Template/WarningInfoBox'

export const WorkOrderList = (props) => {
  const { currentUser, workOrders } = props

  const inProgressWorkOrders =
    workOrders?.filter((wo) => !wo.hasBeenVisited()) ?? null
  const visitedWorkOrders =
    workOrders?.filter((wo) => wo.hasBeenVisited()) ?? null
  const startedWorkOrders =
    workOrders?.filter(
      (wo) => !wo.hasBeenVisited() && !!wo.appointment.startedAt?.length
    ) ?? null

  const getWorkOrderStatusText = (workOrder) => {
    const status = workOrder.status.toLowerCase()

    if (status === 'no access') return 'No access'
    if (status === 'completed') return 'Completed'

    return ''
  }

  const sortWorkOrderItems = (
    currentUser,
    inProgressWorkOrders,
    startedWorkOrders
  ) => {
    // The operative is NOT an OJAAT operative
    if (!currentUser.isOneJobAtATime) return inProgressWorkOrders

    // If the operative has started a work order
    if (startedWorkOrders?.length) return startedWorkOrders

    // Return the next unstarted work order
    return inProgressWorkOrders
      .sort((a, b) => {
        return a.appointment.assignedStart.localeCompare(
          b.appointment.assignedStart
        )
      })
      .slice(0, 1)
  }

  const renderWorkOrderListItems = (workOrders) => {
    return (
      workOrders.length &&
      workOrders.map((workOrder, index) => (
        <MobileWorkingWorkOrderListItem
          key={index}
          workOrder={workOrder}
          index={index}
          statusText={getWorkOrderStatusText(workOrder)}
          currentUser={currentUser}
        />
      ))
    )
  }

  return (
    <>
      {inProgressWorkOrders?.length || visitedWorkOrders?.length ? (
        <>
          <ol className="lbh-list mobile-working-work-order-list">
            {renderWorkOrderListItems(
              sortWorkOrderItems(
                currentUser,
                inProgressWorkOrders,
                startedWorkOrders
              )
            )}
            {renderWorkOrderListItems(visitedWorkOrders)}
          </ol>
        </>
      ) : (
        <WarningInfoBox
          header="No work orders displayed"
          text="Please contact your supervisor"
        />
      )}
    </>
  )
}
