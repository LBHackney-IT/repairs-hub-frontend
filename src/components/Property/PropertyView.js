import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PropertyDetails from './PropertyDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Tabs from '../Tabs'
import Meta from '../Meta'
import WarningInfoBox from '../Template/WarningInfoBox'

const PropertyView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [address, setAddress] = useState({})
  const [tenure, setTenure] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState()
  const [legalDisrepairError, setLegalDisRepairError] = useState()

  const tabsList = ['Work orders history']

  const getPropertyView = async (propertyReference) => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${propertyReference}`,
      })

      const { property, tenure } = data

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

  const renderLegalDisrepair = (isInLegalDisrepair) => {
    return (
      isInLegalDisrepair && (
        <div
          style={{
            marginRight: '18px',
            paddingRight: '400px',
            paddingBottom: '33px',
          }}
        >
          <WarningInfoBox
            header="This property is currently under legal disrepair"
            text="Before raising a work order you must call the Legal Disrepair Team"
          />
        </div>
      )
    )
  }

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
              {renderLegalDisrepair(isInLegalDisrepair)}
              <Tabs tabsList={tabsList} propertyReference={propertyReference} />
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
