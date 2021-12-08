import axios from 'axios'

export const frontEndApiRequest = async ({
  method,
  path,
  params,
  requestData,
  paramsSerializer,
}) => {
  const { data } = await axios({
    method: method,
    url: path,
    params: params,
    ...(requestData && { data: requestData }),
    ...(paramsSerializer && { paramsSerializer }),
  })

  return data
}
