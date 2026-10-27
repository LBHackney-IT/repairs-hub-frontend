type CancelWorkOrderFormData = {
  workOrderReference: string
  cancelReason: string
}

export const buildCancelWorkOrderFormData = (
  formData: CancelWorkOrderFormData
) => {
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
