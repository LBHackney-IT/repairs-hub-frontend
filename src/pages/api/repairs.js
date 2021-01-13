import * as HttpStatus from 'http-status-codes'

import { postRepair, getRepairs } from '../../utils/service-api-client/repairs'
import { isAuthorised } from '../../utils/GoogleAuth'

export default async (req, res) => {
  const user = isAuthorised({ req })
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Auth cookie missing.' })
  }
  try {
    //this condition will be removed when we have "catch all api routes"
    if (req.method === 'GET') {
      const { status, data } = await getRepairs()

      res.status(status).json(data)
    } else {
      const data = await postRepair(req.body)

      res.status(HttpStatus.OK).json(data)
    }
  } catch (err) {
    console.log(`Repair request error: ${req.method}`, err?.response?.data)
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Unable to ${req.method} repair` })
  }
}
