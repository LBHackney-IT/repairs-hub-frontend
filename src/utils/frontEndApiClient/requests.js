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

export const fetchFeatureToggles = async () => {
  try {
    const configurationData = await frontEndApiRequest({
      method: 'GET',
      path: '/api/toggles',
    })

    return configurationData?.[0]?.featureToggles || {}
  } catch (e) {
    console.error(
      `Error fetching toggles from configuration API: ${JSON.stringify(e)}`
    )

    return {}
  }
}
