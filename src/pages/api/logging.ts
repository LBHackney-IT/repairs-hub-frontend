import { StatusCodes } from 'http-status-codes'
import logger from 'loglevel'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  logger.info(req.body)
  res.status(StatusCodes.NO_CONTENT).end()
}
