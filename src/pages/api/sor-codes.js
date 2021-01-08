import { getSorCodes } from '../../utils/service-api-client/sor-codes'

export default async (req, res) => {
  try {
    const { status, data } = await getSorCodes()

    res.status(status).json(data)
  } catch (err) {
    console.log(err)
    return { status: 500 }
  }
}
