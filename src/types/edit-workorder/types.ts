export type EditWorkOrderDescriptionProps = {
  workOrderReference: string
}

export type FormValues = {
  editRepairDescription: string
}

export type NoteData = {
  relatedWorkOrderReference: {
    id: string
  }
  comments: string
  typeCode: string
  otherType: string
}
