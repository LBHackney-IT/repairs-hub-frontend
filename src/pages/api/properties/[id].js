import { getProperty } from '../../../utils/service-api-client/properties'

export default async (req, res) => {
  try {
    const { status, data } = await getProperty(req.query.id)

    res.status(status).json(data)
  } catch (err) {
    console.log(err)
    return { status: 500 }
  }
}
