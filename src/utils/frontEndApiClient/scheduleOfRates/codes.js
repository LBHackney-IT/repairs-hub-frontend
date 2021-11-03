import axios from 'axios'

export const getSorCodes = async (
  tradeCode,
  propertyReference,
  contractorReference,
  isRaisable = false
) => {
  const { data } = await axios.get('/api/schedule-of-rates/codes', {
    params: {
      tradeCode: tradeCode,
      propertyReference: propertyReference,
      contractorReference: contractorReference,
      isRaisable: isRaisable,
    },
  })
  return data
}

export const getSorCode = async (
  code,
  propertyReference,
  contractorReference = false
) => {
  const { data } = await axios.get(`/api/schedule-of-rates/codes/${code}`, {
    params: {
      propertyReference: propertyReference,
      ...(contractorReference && { contractorReference }),
    },
  })

  return data
}
