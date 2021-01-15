import * as HttpStatus from 'http-status-codes'

import { getProperty } from '../../../utils/service-api-client/properties'
import { isAuthorised } from '../../../utils/GoogleAuth'

export default async (req, res) => {
  const user = isAuthorised({ req })
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Auth cookie missing.' })
  }
  try {
    const data = await getProperty(req.query.id)

    res.status(HttpStatus.OK).json(data)
  } catch (err) {
    console.log('Property get error:', err?.response?.data)
    err?.response?.status === HttpStatus.NOT_FOUND
      ? res.status(HttpStatus.NOT_FOUND).json({ message: 'Property Not Found' })
      : res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to get the Property' })
  }
}
