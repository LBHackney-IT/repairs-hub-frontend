import { getProperties } from '../../utils/service-api-client/properties'

export default async (req, res) => {
  try {
    const { status, data } = await getProperties(req.query)

    res.status(status).json(data)
  } catch (err) {
    console.log(err)
    return { status: 500 }
  }
}
