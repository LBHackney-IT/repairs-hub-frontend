export const buildNoteFormData = (formData) => {
  return {
    relatedWorkOrderReference: {
      id: formData.workOrderReference,
    },
    comments: formData.note,
    // Other
    typeCode: '0',
    otherType: 'addNote',
  }
}
