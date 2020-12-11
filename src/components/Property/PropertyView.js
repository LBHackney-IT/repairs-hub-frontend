import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperty } from '../../utils/api/repairs/properties/properties'

const PropertyView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getPropertyView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getProperty(propertyReference)
      setProperty(data.property)
      setLocationAlerts(data.alerts.locationAlert)
    } catch (e) {
      setProperty(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
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
          {property &&
            property.address &&
            property.hierarchyType &&
            locationAlerts && (
              <PropertyDetails
                propertyReference={propertyReference}
                address={property.address}
                hierarchyType={property.hierarchyType}
                locationAlerts={locationAlerts}
              />
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
