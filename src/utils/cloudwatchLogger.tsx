import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { CurrentUser } from '../types/variations/types'
import { useQuery } from 'react-query'
import { useCallback } from 'react'

type Category = 'PHOTOS' | 'WORK_ORDERS' | 'APPOINTMENTS' // Extend as needed

/**
 * Generic logging function for sending messages to be logged on cloudwatch
 * @param message - The log message to send
 */
async function sendLogMessage(message: string): Promise<void> {
  try {
    await frontEndApiRequest({
      method: 'post',
      path: '/api/logging',
      requestData: { message },
      timeout: 5000, // Add timeout to prevent hanging requests
    })
  } catch (loggingError) {
    // Don't throw - logging failures shouldn't break the app
    console.error('Failed to log message:', loggingError)
  }
}

/**
 * React hook for logging messages
 * @param category - The category of the log message (e.g., 'PHOTOS', 'WORK_ORDERS')
 * @param prefix - Optional prefix to add to each log message for context
 */
const useCloudwatchLogger = (category: Category, prefix?: string) => {
  const { data: user } = useQuery<CurrentUser>('currentUser', () =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/hub-user',
    })
  )

  // Formats the log message with user email, category, and optional prefix
  function _buildMessage(message: string, isError: boolean = false): string {
    const emailSplit = user?.email?.split('@')?.[0]?.trim() || 'unknown'
    const prefixText = prefix ? `${prefix} |` : ''
    const errorTag = isError ? 'ERROR |' : ''
    const formatted = `[${category}] ${prefixText} ${errorTag} ${emailSplit} | ${message}`
      .replace(/\s+/g, ' ')
      .trim()
    return formatted
  }

  const _sendLogMessage = useCallback(
    async (message: string): Promise<void> => {
      try {
        await sendLogMessage(message)
      } catch (error) {
        console.error('Logger error:', error)
      }
    },
    [category, prefix, user?.email]
  )

  const log = useCallback(
    async (message: string): Promise<void> => {
      const logMessage = _buildMessage(message, false)
      console.log(logMessage)
      await _sendLogMessage(logMessage)
    },
    [_sendLogMessage]
  )

  const error = useCallback(
    async (message: string): Promise<void> => {
      const logMessage = _buildMessage(message, true)
      console.error(logMessage)
      await _sendLogMessage(logMessage)
    },
    [_sendLogMessage]
  )

  return { log, error }
}

export default useCloudwatchLogger
