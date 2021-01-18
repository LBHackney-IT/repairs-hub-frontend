import * as HttpStatus from 'http-status-codes'

import { postRepair } from '../../utils/service-api-client/repairs'
import { isAuthorised } from '../../utils/GoogleAuth'

export default async (req, res) => {
  const user = isAuthorised({ req })
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Auth cookie missing.' })
  }
  try {
    const data = await postRepair(req.body)

    res.status(HttpStatus.OK).json(data)
  } catch (err) {
    console.log('Error posting repair:', err?.response?.data)
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to post repair' })
  }
}
