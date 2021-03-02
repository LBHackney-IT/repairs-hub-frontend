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

export const buildDataFromScheduleAppointment = (
  workOrderReference,
  comments
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
