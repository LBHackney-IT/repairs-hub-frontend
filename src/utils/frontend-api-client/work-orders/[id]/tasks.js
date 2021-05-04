import axios from 'axios'

export const getTasksAndSors = async (workOrderReference) => {
  const { data } = await axios.get(
    `/api/workOrders/${workOrderReference}/tasks`
  )

  return data
}
