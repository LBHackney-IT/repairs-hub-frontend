import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperty } from '../../utils/api/repairs/properties/properties'
import { getAlerts } from '../../utils/api/repairs/properties/cautionary_alerts'

const PropertyView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [addressAlerts, setaddressAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getPropertyView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getProperty(propertyReference)
      setProperty(data)
    } catch (e) {
      setProperty(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  const getAlertsView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getAlerts(propertyReference)
      setaddressAlerts(data.alerts)
    } catch (e) {
      setaddressAlerts([])
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
    getAlertsView(propertyReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {property && property.address && property.hierarchyType && (
            <PropertyDetails
              propertyReference={propertyReference}
              address={property.address}
              hierarchyType={property.hierarchyType}
              cautionaryAlerts={addressAlerts}
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
