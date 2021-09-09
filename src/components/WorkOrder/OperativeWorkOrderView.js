import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import OperativeWorkOrderDetails from './OperativeWorkOrderDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { WorkOrder } from '../../models/workOrder'
import { sortObjectsByDateKey } from '../../utils/date'
import TasksAndSorsView from './TasksAndSors/TasksAndSorsView'

const OperativeWorkOrderView = ({ workOrderReference }) => {
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getOperativeWorkOrderView = async (workOrderReference) => {
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

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      setTasksAndSors(
        sortObjectsByDateKey(tasksAndSors, ['dateAdded'], 'dateAdded')
      )

      setWorkOrder(new WorkOrder(workOrder))
      setProperty(propertyObject.property)
      setPersonAlerts(propertyObject.alerts.personAlert)
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

    getOperativeWorkOrderView(workOrderReference)
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
            personAlerts &&
            workOrder && (
              <>
                <OperativeWorkOrderDetails
                  property={property}
                  workOrder={workOrder}
                  personAlerts={personAlerts}
                  tasksAndSors={tasksAndSors}
                />

                <TasksAndSorsView
                  workOrderReference={workOrderReference}
                  tabName={'Tasks and SORs'}
                  tasksAndSors={tasksAndSors}
                  showOperativeTasksAndSorsTable={true}
                />
              </>
            )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

OperativeWorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default OperativeWorkOrderView
