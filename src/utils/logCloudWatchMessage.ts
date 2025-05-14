import { LogRequestBody } from '../pages/api/log'
import { frontEndApiRequest } from './frontEndApiClient/requests'

/**
 * Utility function for logging messages to AWS CloudWatch
 */
function logCloudWatchMessage(
  message: string,
  logLevel: 'info' | 'warn' | 'error' = 'info'
): void {
  const requestData: LogRequestBody = {
    message,
    logLevel: logLevel.toLowerCase().trim() as 'info' | 'warn' | 'error',
  }
  frontEndApiRequest({
    method: 'post',
    path: '/api/log',
    requestData: requestData,
  }).catch((error: unknown) => {
    console.error(`Failed to log message: ${message}`, error)
  })
}

export default logCloudWatchMessage
