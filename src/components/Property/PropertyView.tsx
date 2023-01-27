import PropTypes from 'prop-types'
import { FunctionComponent } from 'react'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Tabs from '../Tabs'
import Meta from '../Meta'

import { Property, Address, Tenure } from './types'

interface Props {
  propertyReference: string
}

const PropertyView: FunctionComponent<Props> = ({ propertyReference }) => {
  const [property, setProperty] = useState<Property>(null)
  const [address, setAddress] = useState<Address>(null)
  const [tenure, setTenure] = useState<Tenure>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const tabsList = ['Work orders history']

  const getPropertyView = async (propertyReference: string) : Promise<void> => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${propertyReference}`,
        params: null,
        paramsSerializer: null,
        requestData: null
      })


      const { property, tenure } : { property: Property, tenure: Tenure } = data 
      const { address} : { address: Address } = property

      setProperty(property)
      setAddress(address)

      tenure && setTenure(tenure)
    } catch (e) {
      setProperty(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getPropertyView(propertyReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Meta title={address?.addressLine} />
          {property && address && property.hierarchyType && tenure && (
            <>
              <PropertyDetails
                propertyReference={propertyReference}
                address={address}
                hierarchyType={property.hierarchyType}
                canRaiseRepair={property.canRaiseRepair}
                tenure={tenure}
                tmoName={property.tmoName}
              />
               {/* @ts-expect-error */}
              <Tabs tabsList={tabsList} propertyReference={propertyReference} />
            </>
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}


export default PropertyView
