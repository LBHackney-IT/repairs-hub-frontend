import retry from 'retry'

const DEFAULT_NUMBER_OF_RETRIES = 3

const faultTolerantRequest = async (
  request: () => Promise<void>,
  retries: number = DEFAULT_NUMBER_OF_RETRIES
): Promise<{
  success: boolean
  error?: any
}> => {
  const operation = retry.operation({
    retries,
  })

  return new Promise((resolve) => {
    operation.attempt(() => {
      request()
        .then(() => {
          resolve({
            success: true,
          })
        })
        .catch((err) => {
          if (operation.retry(err)) return

          resolve({
            success: false,
            error: operation.mainError(),
          })
        })
    })
  })
}

export default faultTolerantRequest
