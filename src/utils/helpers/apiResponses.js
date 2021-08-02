import HttpStatus from 'http-status-codes'

export const isSpendLimitReachedResponse = (response) =>
  response?.status === HttpStatus.UNAUTHORIZED &&
  response?.data?.message?.toLowerCase().match('limit')
