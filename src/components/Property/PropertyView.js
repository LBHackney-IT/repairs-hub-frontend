import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getProperty } from '../../utils/frontend-api-client/properties'
import Tabs from '../Tabs'

const PropertyView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const tabsList = ['Repairs history']

  const getPropertyView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getProperty(propertyReference)

      setProperty(data.property)
      setLocationAlerts(data.alerts.locationAlert)
      setPersonAlerts(data.alerts.personAlert)
      if (data.tenure) setTenure(data.tenure)
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
          {property &&
            property.address &&
            property.hierarchyType &&
            tenure &&
            locationAlerts &&
            personAlerts && (
              <>
                <PropertyDetails
                  propertyReference={propertyReference}
                  address={property.address}
                  hierarchyType={property.hierarchyType}
                  canRaiseRepair={property.canRaiseRepair}
                  tenure={tenure}
                  locationAlerts={locationAlerts}
                  personAlerts={personAlerts}
                />
                {property.canRaiseRepair && (
                  <Tabs
                    tabsList={tabsList}
                    propertyReference={propertyReference}
                  />
                )}
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
