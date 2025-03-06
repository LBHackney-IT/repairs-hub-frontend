export type ApiResponseType<T = unknown> = {
  success: boolean
  response: T | null
  error: string | null
}

export type NoteDataType = {
  relatedWorkOrderReference: {
    id: string
  }
  comments: string
  typeCode: string
  otherType: string
}
