import { useEffect, useState } from 'react'
import { frontEndApiRequest } from '../utils/frontEndApiClient/requests'

type BoilerHouse = {
  propertyReference: string
  addressLine1: string
}

export const usePropertyBoilerHouse = (boilerHouseId: string) => {
  const [loading, setLoading] = useState(true)
  const [boilerHouse, setBoilerHouse] = useState<BoilerHouse | null>(null)
  const [boilerHouseError, setBoilerHouseError] = useState<string>()

  useEffect(() => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/guid-pk/${boilerHouseId}`,
    })
      .then((res) => {
        setBoilerHouse({
          propertyReference: res.propertyReference,
          addressLine1: res.address.addressLine,
        })
      })
      .catch((error) => {
        console.error(error)

        setBoilerHouseError(
          `Error loading boiler house details status ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { loading, boilerHouse, boilerHouseError }
}
