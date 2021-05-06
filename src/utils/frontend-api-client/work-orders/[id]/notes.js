import axios from 'axios'

export const getNotes = async (workOrderReference) => {
  const { data } = await axios.get(
    `/api/workOrders/${workOrderReference}/notes`
  )

  return data
}
