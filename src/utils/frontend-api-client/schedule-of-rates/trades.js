import axios from 'axios'

export const getTrades = async (propertyReference) => {
  const { data } = await axios.get(
    `/api/schedule-of-rates/trades?propRef=${propertyReference}`
  )

  return data
}
