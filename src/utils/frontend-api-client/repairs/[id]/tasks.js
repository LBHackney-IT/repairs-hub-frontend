import axios from 'axios'

export const getTasksAndSors = async (workOrderReference) => {
  const { data } = await axios.get(`/api/repairs/${workOrderReference}/tasks`)

  return data
}
