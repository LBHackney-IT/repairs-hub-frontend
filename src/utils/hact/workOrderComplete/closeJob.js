export const buildCloseWorkOrderData = (
  completionDate,
  notes,
  reference,
  reason
) => {
  return {
    workOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    jobStatusUpdates: [
      {
        typeCode: reason == 'No Access' ? '70' : '0',
        otherType: 'complete',
        comments: `Work order closed - ${notes}`,
        eventTime: completionDate,
      },
    ],
  }
}
