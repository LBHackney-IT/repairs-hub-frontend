export const formatRequestErrorMessage = (e: any) => {
  return `Oops an error occurred with error status: ${
    e.response?.status
  } with message: ${JSON.stringify(e.response?.data?.message)}`
}
