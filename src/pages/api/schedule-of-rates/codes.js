import * as HttpStatus from 'http-status-codes'

import { getSorCodes } from '../../../utils/service-api-client/schedule-of-rates/codes'
import { isAuthorised } from '../../../utils/GoogleAuth'

export default async (req, res) => {
  const user = isAuthorised({ req })
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Auth cookie missing.' })
  }
  try {
    const data = await getSorCodes()

    res.status(HttpStatus.OK).json(data)
  } catch (err) {
    console.log('SOR Codes get error:', err?.response?.data)
    err?.response?.status === HttpStatus.NOT_FOUND
      ? res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'SOR Codes Not Found' })
      : res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to get the SOR Codes' })
  }
}
