import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem';

export const MobileWorkingWorkOrderListItems = ({ workOrders, currentUser }) => {
  const formatStatusText = (statusText) => {
    const status = statusText.toLowerCase();

    if (status === 'no access') return 'No access';
    if (status === 'completed') return 'Completed';

    return '';
  };

  if (workOrders === null || workOrders?.length === 0) {
    return <></>;
  }

  return workOrders.map((workOrder, index) => (
    <MobileWorkingWorkOrderListItem
      key={index}
      workOrder={workOrder}
      index={index}
      statusText={(() => formatStatusText(workOrder.status))()}
      currentUser={currentUser} />
  ));
};
