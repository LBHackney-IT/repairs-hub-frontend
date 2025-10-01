import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let message: string

  // Handle different body formats (Buffer, object, string)
  if (Buffer.isBuffer(req.body)) {
    message = req.body.toString('utf8')
    try {
      const parsed = JSON.parse(message)
      message = parsed.message || message
    } catch {
      // If parsing fails, use the raw string
    }
  } else if (typeof req.body === 'object' && req.body !== null) {
    message = req.body.message || JSON.stringify(req.body)
  } else {
    message = String(req.body || 'No message provided')
  }

  // Log the message
  console.log('LOGGING_ENDPOINT_HIT:', message)
  console.error('LOGGING_ENDPOINT_ERROR:', message)
  process.stdout.write(`STDOUT: ${message}\n`)
  process.stderr.write(`STDERR: ${message}\n`)

  // Force console flush before responding
  await new Promise((resolve) => process.nextTick(resolve))

  res.status(StatusCodes.NO_CONTENT).end()
}
