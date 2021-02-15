import axios from 'axios'

export const getContractors = async (propertyReference, tradeCode) => {
  const { data } = await axios.get(
    `/api/contractors?propertyReference=${propertyReference}&tradeCode=${tradeCode}`
  )

  return data
}
