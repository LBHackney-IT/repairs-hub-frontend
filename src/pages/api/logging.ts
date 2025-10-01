import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let message: string

  // Handle different body formats (Buffer, object, string)
  // Will be Buffer on AWS Lambda and object/string on local dev
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

  console.log(message)
  // await new Promise((resolve) => process.nextTick(resolve))

  res.status(StatusCodes.NO_CONTENT).end()
}
