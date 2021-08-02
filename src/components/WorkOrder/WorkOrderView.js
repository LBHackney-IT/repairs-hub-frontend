import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { getOrCreateSchedulerSessionId } from '../../utils/frontEndApiClient/users/schedulerSession'
import Tabs from '../Tabs'
import { WorkOrder } from '../../models/workOrder'

const WorkOrderView = ({ workOrderReference }) => {
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [schedulerSessionId, setSchedulerSessionId] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const tabsList = [
    'Tasks and SORs',
    'Notes',
    'Pending variation',
    'Repairs history',
  ]

  const getWorkOrderView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })
      const propertyObject = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${workOrder.propertyReference}`,
      })

      // Call getOrCreateSchedulerSessionId if it is a DRS work order
      if (workOrder.externalAppointmentManagementUrl) {
        const schedulerSessionId = await getOrCreateSchedulerSessionId()
        setSchedulerSessionId(schedulerSessionId)
      }

      setWorkOrder(new WorkOrder(workOrder))
      setProperty(propertyObject.property)
      setLocationAlerts(propertyObject.alerts.locationAlert)
      setPersonAlerts(propertyObject.alerts.personAlert)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
    } catch (e) {
      setWorkOrder(null)
      setProperty(null)
      console.error('An error has occured:', e.response)

      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
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
              <>
                <WorkOrderDetails
                  propertyReference={property.propertyReference}
                  workOrder={workOrder}
                  address={property.address}
                  tenure={tenure}
                  subTypeDescription={property.hierarchyType.subTypeDescription}
                  locationAlerts={locationAlerts}
                  personAlerts={personAlerts}
                  canRaiseRepair={property.canRaiseRepair}
                  schedulerSessionId={schedulerSessionId}
                />
                <Tabs
                  tabsList={tabsList}
                  propertyReference={property.propertyReference}
                  workOrderReference={workOrderReference}
                />
              </>
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
