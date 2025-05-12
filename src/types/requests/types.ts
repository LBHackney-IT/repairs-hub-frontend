export class APIResponseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'APIResponseError'

    Object.setPrototypeOf(this, APIResponseError.prototype)
  }
}

export type ApiResponseType<T> = {
  success: boolean
  response: T | null
  error: APIResponseError | null
}

export type NoteDataType = {
  relatedWorkOrderReference: {
    id: string
  }
  comments: string
  typeCode: string
  otherType: string
}
