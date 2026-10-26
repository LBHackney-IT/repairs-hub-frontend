export const buildNoteFormData = (formData: {
  workOrderReference: string
  note: string
}) => {
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

export const buildDataFromScheduleAppointment = (
  workOrderReference: string,
  comments: string
) => {
  return {
    relatedWorkOrderReference: {
      id: workOrderReference,
    },
    comments: comments,
    // Other
    typeCode: '0',
    otherType: 'addNote',
  }
}
