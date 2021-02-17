import axios from 'axios'

export const getSorCodes = async () => {
  const { data } = await axios.get('/api/schedule-of-rates/codes')

  return data
}

export const getSorCodesByTradeAndContractor = async (
  tradeCode,
  propertyReference,
  contractorReference
) => {
  const { data } = await axios.get('/api/schedule-of-rates/codes', {
    params: {
      tradeCode: tradeCode,
      propertyReference: propertyReference,
      contractorReference: contractorReference,
    },
  })

  return data
}
