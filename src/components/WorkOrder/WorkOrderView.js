import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Tabs from '../Tabs'
import { WorkOrder } from '@/models/workOrder'
import { sortObjectsByDateKey } from '@/utils/date'
import PrintJobTicketDetails from './PrintJobTicketDetails'

const WorkOrderView = ({ workOrderReference }) => {
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const tabsList = [
    'Tasks and SORs',
    'Notes',
    'Pending variation',
    'Work orders history',
    'Photos',
  ]

  const { NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL } = process.env

  const printClickHandler = (e) => {
    e.preventDefault()

    if (document.getElementById('rear-image')) {
      window.print()
    } else {
      const workOrderRearImage = document.createElement('img')
      workOrderRearImage.src = `${NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL}/work-order-rear.png`
      workOrderRearImage.id = 'rear-image'

      workOrderRearImage.addEventListener('load', () => window.print())

      document
        .getElementById('rear-image-container')
        .appendChild(workOrderRearImage)
    }
  }

  const getWorkOrderView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderPromise = frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })

      const tasksAndSorsPromise = frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      const workOrder = await workOrderPromise

      const propertyPromise = frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${workOrder.propertyReference}`,
      })

      const [tasksAndSors, propertyObject] = await Promise.all([
        tasksAndSorsPromise,
        propertyPromise,
      ])

      setTasksAndSors(
        sortObjectsByDateKey(tasksAndSors, ['dateAdded'], 'dateAdded')
      )

      setWorkOrder(new WorkOrder(workOrder))
      setProperty(propertyObject.property)
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
          `Oops an error occurred with error status: ${
            e.response?.status
          } with message: ${JSON.stringify(e.response?.data?.message)}`
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
            workOrder && (
              <>
                <WorkOrderDetails
                  property={property}
                  workOrder={workOrder}
                  tenure={tenure}
                  tasksAndSors={tasksAndSors}
                  printClickHandler={printClickHandler}
                  setLocationAlerts={setLocationAlerts}
                  setPersonAlerts={setPersonAlerts}
                />
                <Tabs
                  tabsList={tabsList}
                  propertyReference={property.propertyReference}
                  workOrderReference={workOrderReference}
                  tasksAndSors={tasksAndSors}
                  budgetCode={workOrder.budgetCode}
                  workOrder={workOrder}
                />
                {/* Only displayed for print media */}
                <PrintJobTicketDetails
                  workOrder={workOrder}
                  property={property}
                  tasksAndSors={tasksAndSors}
                  locationAlerts={locationAlerts}
                  personAlerts={personAlerts}
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
