import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const message = req.body?.message || JSON.stringify(req.body)
  console.log(message)
  res.status(StatusCodes.NO_CONTENT).end()
}
