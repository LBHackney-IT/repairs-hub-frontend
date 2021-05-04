export const buildCloseWorkOrderData = (completionDate, notes, reference) => {
  return {
    workOrderReference: {
      id: reference,
      description: '',
      allocatedBy: '',
    },
    jobStatusUpdates: [
      {
        typeCode: 0,
        otherType: 'complete',
        comments: notes,
        eventTime: completionDate,
      },
    ],
  }
}
