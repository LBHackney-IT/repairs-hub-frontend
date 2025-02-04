export type ApiResponseType<T> = {
  success: boolean
  response: T | null
  error: string | null
}
