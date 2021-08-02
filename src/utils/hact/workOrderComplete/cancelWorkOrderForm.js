export const buildCancelWorkOrderFormData = (formData) => {
  return {
    workOrderReference: {
      id: formData.workOrderReference,
    },
    jobStatusUpdates: [
      {
        typeCode: 0,
        otherType: 'cancel',
        comments: `Cancelled: ${formData.cancelReason}`,
        eventTime: new Date(),
      },
    ],
  }
}
