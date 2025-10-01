import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const message = req.body?.message || JSON.stringify(req.body)

  // Log the message
  console.log('CLOUDWATCH_LOG:', message)

  // Force console flush before responding
  await new Promise((resolve) => process.nextTick(resolve))

  res.status(StatusCodes.NO_CONTENT).end()
}
