import { NextApiRequest, NextApiResponse } from 'next'

export interface LogRequestBody {
  message: string
  logLevel?: 'info' | 'warn' | 'error'
}

/**
 * Logs a message to cloudwatch logs - to be called by the frontend
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message, logLevel } = req.body as LogRequestBody
  if (!message)
    return res.status(400).json({ message: `Invalid message: ${message}` })

  let resolvedLogLevel = logLevel?.toLowerCase().trim() || 'info'
  if (!['info', 'warn', 'error'].includes(resolvedLogLevel))
    resolvedLogLevel = 'info'

  const logMessage = `[${resolvedLogLevel.toUpperCase()}] ${message} `
  console[resolvedLogLevel]?.(logMessage)
  return res.status(204).end()
}
