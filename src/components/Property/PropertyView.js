import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Tabs from '../Tabs'
import Meta from '../Meta'

const PropertyView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [address, setAddress] = useState({})
  const [tenure, setTenure] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const tabsList = ['Work orders history']

  const getPropertyView = async (propertyReference) => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${propertyReference}`,
      })

      const { property, tenure } = data

      // placeholder add boilerHouseId in response
      property["boilerHouseId"] = "4552c539-2e00-8533-078d-9cc59d9115da"

      setProperty(property)
      setAddress(property.address)
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
          <Meta title={address.addressLine} />
          {property && address && property.hierarchyType && tenure && (
            <>
              <PropertyDetails
                propertyReference={propertyReference}
                boilerHouseId={property.boilerHouseId}
                address={address}
                hierarchyType={property.hierarchyType}
                canRaiseRepair={property.canRaiseRepair}
                tenure={tenure}
                tmoName={property.tmoName}
              />
              <Tabs tabsList={tabsList} propertyReference={propertyReference} />
            </>
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

PropertyView.propTypes = {
  propertyReference: PropTypes.string.isRequired,
}

export default PropertyView
