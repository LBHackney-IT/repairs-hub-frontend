import retry from 'retry'

const DEFAULT_NUMBER_OF_RETRIES = 3

/**
 * Returns a promise that tries to successfully resolve
 * a specified amount of times with exponential backoff
 */
const faultTolerantRequest = async <T>(
  request: () => Promise<T>,
  retries: number = DEFAULT_NUMBER_OF_RETRIES
): Promise<{
  success: boolean
  data?: T
  error?: Error
}> => {
  const operation = retry.operation({
    retries,
  })

  return new Promise((resolve) => {
    operation.attempt(() => {
      request()
        .then((result) => {
          resolve({
            success: true,
            data: result,
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
