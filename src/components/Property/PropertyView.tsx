import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Meta from '../Meta'
import PropertyViewTabs from '../Tabs/Views/PropertyViewTabs'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import { PropertyResponse } from '../../models/propertyResponse'
import { Property } from '../../models/property'
import { Tenure } from '../../models/tenure'

const PropertyView = ({ propertyReference }) => {
  const [property, setProperty] = useState<Property>(null)
  const [tenure, setTenure] = useState<Tenure>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState(null)
  const [legalDisrepairError, setLegalDisRepairError] = useState(null)

  const getPropertyView = async (propertyReference) => {
    setError(null)

    try {
      const data: PropertyResponse = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${propertyReference}`,
      })

      setProperty(data.property)
      if (data.tenure) setTenure(data.tenure)
    } catch (e) {
      setProperty(null)
      console.error('An error has occured:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const getPropertyInfoOnLegalDisrepair = (propertyReference) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/legalDisrepair/${propertyReference}`,
    })
      .then((isInLegalDisrepair) =>
        setIsInLegalDisrepair(isInLegalDisrepair.propertyIsInLegalDisrepair)
      )
      .catch((error) => {
        console.error('Error loading legal disrepair status:', error.response)
        setLegalDisRepairError(
          `Error loading legal disrepair status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)

    getPropertyView(propertyReference)
    getPropertyInfoOnLegalDisrepair(propertyReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Meta title={property?.address.addressLine} />
          {property?.address && property?.hierarchyType && tenure && (
            <>
              <PropertyDetails
                property={property}
                tenure={tenure}
                isInLegalDisrepair={isInLegalDisrepair}
              />
              <PropertyViewTabs propertyReference={propertyReference} />
            </>
          )}

          {error && <ErrorMessage label={error} />}
          {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}
        </>
      )}
    </>
  )
}

PropertyView.propTypes = {
  propertyReference: PropTypes.string.isRequired,
}

export default PropertyView
