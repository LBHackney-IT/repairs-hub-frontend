import { postRaiseRepairForm } from '../../utils/service-api-client/raise-repair'

export default async (req, res) => {
  try {
    const { status, data } = await postRaiseRepairForm(req.body)

    res.status(status).json(data)
  } catch (err) {
    console.log(err)
    return { status: 500 }
  }
}
