import { StatusCodes } from 'http-status-codes'
import logger from 'loglevel'

const loggingHandler = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: 'Method not allowed. Only POST requests are accepted.',
    })
  }

  const { message } = req.body
  if (!message || typeof message !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Message must be a string',
    })
  }

  logger.info(message)

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Message logged successfully',
  })
}

export default loggingHandler
