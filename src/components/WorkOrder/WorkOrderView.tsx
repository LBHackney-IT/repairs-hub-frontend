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
import { getOrCreateSchedulerSessionId } from '../../utils/frontEndApiClient/users/schedulerSession'

interface Props {
  workOrderReference: string
}

interface IProperty {
  address: {
    addressLine: string
    streetSuffix: string
    postalCode: string
  }
  tmoName: string
  hierarchyType: string
  propertyReference: string
}

const WorkOrderView = ({ workOrderReference }: Props) => {
  const [property, setProperty] = useState<IProperty | null>()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>()
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [schedulerSessionId, setSchedulerSessionId] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const tabsList = [
    'Tasks and SORs',
    'Notes',
    'Pending variation',
    'Work orders history',
    'Photos',
  ]

  const getSchedulerSessionId = async () => {
    const schedulerSessionId = await getOrCreateSchedulerSessionId()
    setSchedulerSessionId(schedulerSessionId)
  }

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

  const getWorkOrderView = async (workOrderReference: string) => {
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

      // Call getOrCreateSchedulerSessionId if it is a DRS work order
      if (workOrder.externalAppointmentManagementUrl) {
        await getSchedulerSessionId()
      }

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

  if (loading) return <Spinner />

  return (
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
              resetSchedulerSessionId={getSchedulerSessionId}
              schedulerSessionId={schedulerSessionId}
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
  )
}

WorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default WorkOrderView