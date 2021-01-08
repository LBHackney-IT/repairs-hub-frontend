import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RaiseRepairForm from './RaiseRepairForm'
import RaiseRepairFormSuccess from './RaiseRepairFormSuccess'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { getProperty } from '../../../utils/frontend-api-client/properties'
import { getSorCodes } from '../../../utils/frontend-api-client/sor-codes'
import { postRaiseRepairForm } from '../../../utils/frontend-api-client/raise-repair'

const RaiseRepairFormView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [sorCodes, setSorCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [formSuccess, setFormSuccess] = useState(false)
  const [workOrderReference, setWorkOrderReference] = useState()

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      const ref = await postRaiseRepairForm(formData)

      setWorkOrderReference(ref)
      setFormSuccess(true)
    } catch (e) {
      console.log(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  const getRaiseRepairFormView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getProperty(propertyReference)
      const sorCodes = await getSorCodes()

      setTenure(data.tenure)
      setProperty(data.property)
      setLocationAlerts(data.alerts.locationAlert)
      setPersonAlerts(data.alerts.personAlert)
      setSorCodes(sorCodes.result)
    } catch (e) {
      setProperty(null)
      setSorCodes(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getRaiseRepairFormView(propertyReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {formSuccess && (
            <RaiseRepairFormSuccess
              propertyReference={propertyReference}
              workOrderReference={workOrderReference}
              shortAddress={property.address.shortAddress}
            />
          )}
          {!formSuccess &&
            tenure.canRaiseRepair &&
            property &&
            property.address &&
            property.hierarchyType &&
            locationAlerts &&
            personAlerts &&
            sorCodes && (
              <RaiseRepairForm
                address={property.address}
                hierarchyType={property.hierarchyType}
                tenure={tenure}
                locationAlerts={locationAlerts}
                personAlerts={personAlerts}
                sorCodes={sorCodes}
                onFormSubmit={onFormSubmit}
              />
            )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

RaiseRepairFormView.propTypes = {
  propertyReference: PropTypes.string.isRequired,
}

export default RaiseRepairFormView
