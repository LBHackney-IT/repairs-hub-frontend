import HttpStatus from 'http-status-codes'

type ApiErrorResponse = {
  status?: number
  data?: { message?: string }
}

export const isSpendLimitReachedResponse = (
  response?: ApiErrorResponse
): RegExpMatchArray | null | false | undefined =>
  response?.status === HttpStatus.UNAUTHORIZED &&
  response?.data?.message?.toLowerCase().match('limit')
