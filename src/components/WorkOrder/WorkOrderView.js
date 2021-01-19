import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getRepair } from '../../utils/frontend-api-client/repairs'
import { getProperty } from '../../utils/frontend-api-client/properties'

const WorkOrderView = ({ workOrderReference }) => {
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getWorkOrderView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrder = await getRepair(workOrderReference)
      const propertyObject = await getProperty(workOrder.propertyReference)

      setWorkOrder(workOrder)
      setProperty(propertyObject.property)
      setLocationAlerts(propertyObject.alerts.locationAlert)
      setPersonAlerts(propertyObject.alerts.personAlert)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
    } catch (e) {
      setWorkOrder(null)
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

    getWorkOrderView(workOrderReference)
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
            personAlerts &&
            workOrder && (
              <WorkOrderDetails
                propertyReference={property.propertyReference}
                workOrder={workOrder}
                address={property.address}
                tenure={tenure}
                subTypeDescription={property.hierarchyType.subTypeDescription}
                locationAlerts={locationAlerts}
                personAlerts={personAlerts}
                canRaiseRepair={property.canRaiseRepair}
              />
            )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

WorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default WorkOrderView
