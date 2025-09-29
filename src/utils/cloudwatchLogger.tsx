import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { CurrentUser } from '../types/variations/types'
import { useCallback, useEffect, useState } from 'react'

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
const useCloudwatchLogger = (
  category: Category,
  prefix?: string,
  currentUser?: CurrentUser
) => {
  const [user, setUser] = useState<CurrentUser | null>(currentUser)

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
      return
    }
    frontEndApiRequest({
      method: 'get',
      path: '/api/hub-user',
    })
      .then(({ data }: { data: CurrentUser }) => {
        setUser(data)
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error)
      })
  }, [])

  // Formats the log message with user email, category, and optional prefix
  const _buildMessage = useCallback(
    (message: string, isError: boolean = false): string => {
      const emailSplit = user?.email?.split('@')?.[0]?.trim() || 'unknown'
      const prefixText = prefix ? `${prefix} |` : ''
      const errorTag = isError ? 'ERROR |' : ''
      const formatted = `[${category}] ${prefixText} ${errorTag} ${emailSplit} | ${message}`
        .replace(/\s+/g, ' ')
        .trim()
      return formatted
    },
    [user?.email, category, prefix]
  )

  const log = useCallback(
    (message: string): void => {
      const logMessage = _buildMessage(message, false)
      console.log(logMessage)
      sendLogMessage(logMessage)
    },
    [_buildMessage]
  )

  const error = useCallback(
    (message: string): void => {
      const logMessage = _buildMessage(message, true)
      console.error(logMessage)
      sendLogMessage(logMessage)
    },
    [_buildMessage]
  )

  return { log, error }
}

export default useCloudwatchLogger
