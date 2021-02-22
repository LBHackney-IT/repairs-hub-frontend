import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RaiseRepairForm from './RaiseRepairForm'
import RaiseRepairFormSuccess from './RaiseRepairFormSuccess'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { getProperty } from '../../../utils/frontend-api-client/properties'
import { getPriorities } from '../../../utils/frontend-api-client/schedule-of-rates/priorities'
import { postRepair } from '../../../utils/frontend-api-client/repairs/schedule'
import { getTrades } from '../../../utils/frontend-api-client/schedule-of-rates/trades'

const RaiseRepairFormView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [trades, setTrades] = useState([])
  const [priorities, setPriorities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [formSuccess, setFormSuccess] = useState(false)
  const [workOrderReference, setWorkOrderReference] = useState()

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      const ref = await postRepair(formData)

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
      const priorities = await getPriorities()
      const trades = await getTrades(propertyReference)

      setTenure(data.tenure)
      setProperty(data.property)
      setLocationAlerts(data.alerts.locationAlert)
      setPersonAlerts(data.alerts.personAlert)
      setPriorities(priorities)
      setTrades(trades)
    } catch (e) {
      setProperty(null)
      setPriorities(null)
      setTrades(null)
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
          {formSuccess && workOrderReference && (
            <RaiseRepairFormSuccess
              propertyReference={propertyReference}
              workOrderReference={workOrderReference}
              shortAddress={property.address.shortAddress}
            />
          )}
          {!formSuccess &&
            property &&
            property.address &&
            property.hierarchyType &&
            property.canRaiseRepair &&
            locationAlerts &&
            personAlerts &&
            priorities &&
            trades && (
              <RaiseRepairForm
                propertyReference={propertyReference}
                address={property.address}
                hierarchyType={property.hierarchyType}
                canRaiseRepair={property.canRaiseRepair}
                tenure={tenure}
                locationAlerts={locationAlerts}
                personAlerts={personAlerts}
                priorities={priorities}
                trades={trades}
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
