import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { CurrentUser } from '../types/variations/types'

type Category = 'PHOTOS'

export class CloudwatchLogger {
  private currentUser: CurrentUser

  private constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser
  }

  static async create(): Promise<CloudwatchLogger> {
    const currentUser = await CloudwatchLogger.fetchCurrentUser()
    return new CloudwatchLogger(currentUser)
  }

  private static async fetchCurrentUser(): Promise<CurrentUser> {
    const currentUser: CurrentUser = await frontEndApiRequest({
      method: 'get',
      path: '/api/hub-user',
    })

    return currentUser
  }

  /**
   * Generic logging function for sending messages to be logged on cloudwatch
   * @param category - The category of the log message
   * @param message - The message to log
   */
  async logMessage(message: string) {
    try {
      const emailSplit = this.currentUser.email?.split('@')[0] || 'unknown'
      const formattedMessage = `${emailSplit} | ${message}`
      console.log(formattedMessage)
      await frontEndApiRequest({
        method: 'post',
        path: '/api/logging',
        requestData: { message: formattedMessage },
      })
    } catch (loggingError) {
      console.error('Failed to log message:', loggingError)
    }
  }
}

// Singleton instance cache
let loggerInstance: CloudwatchLogger | null = null

// Function to get the singleton logger instance
const getLogger = async (): Promise<CloudwatchLogger> => {
  if (!loggerInstance) {
    loggerInstance = await CloudwatchLogger.create()
  }
  return loggerInstance
}

/**
 * React hook for logging messages
 * @returns Object with logMessage function
 */
const useCloudwatchLogger = (category: Category, prefix?: string) => {
  const logMessage = async (message: string) => {
    try {
      const logger = await getLogger()
      const prefix_text = prefix ? `${prefix} |` : ''
      await logger.logMessage(`[${category}] ${prefix_text} ${message}`)
    } catch (error) {
      console.error('Logger error:', error)
    }
  }

  return { logMessage }
}

export default useCloudwatchLogger
