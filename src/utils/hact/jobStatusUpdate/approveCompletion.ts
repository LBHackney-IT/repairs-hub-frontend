export const buildApproveCompletionFormData = (
  workOrderReference: string,
  note?: string
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    comments: note?.trim() ?? '',
    // Other
    typeCode: '0',
    otherType: 'approveCompletion',
  }
}
