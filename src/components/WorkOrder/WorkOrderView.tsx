import { useState, useEffect } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { sortObjectsByDateKey } from '@/utils/date'
import PrintJobTicketDetails from './PrintJobTicketDetails'
import WorkOrderViewTabs from '../Tabs/Views/WorkOrderViewTabs'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import { Tenure } from '../../models/tenure'
import { getWorkOrder } from '../../utils/requests/workOrders'
import { APIResponseError } from '../../types/requests/types'
import { Property } from '../../models/property'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'

const { NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL } = process.env

interface Props {
  workOrderReference: string
}

const WorkOrderView = ({ workOrderReference }: Props) => {
  const [property, setProperty] = useState<Property>()
  const [workOrder, setWorkOrder] = useState<WorkOrder>()
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [locationAlerts, setLocationAlerts] = useState<CautionaryAlert[]>([])
  const [personAlerts, setPersonAlerts] = useState<CautionaryAlert[]>([])
  const [tenure, setTenure] = useState<Tenure>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>()

  const printClickHandler = () => {
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

    setIsLoading(true)

    try {
      const workOrderPromise = getWorkOrder(workOrderReference, true)

      const tasksAndSorsPromise = frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      const workOrderResponse = await workOrderPromise

      if (!workOrderResponse.success) {
        throw workOrderResponse.error
      }

      const workOrder = workOrderResponse.response

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

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        if (e.response?.status === 404) {
          setError(
            `Could not find a work order with reference ${workOrderReference}`
          )
        } else {
          setError(formatRequestErrorMessage(e))
        }
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getWorkOrderView(workOrderReference)
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage label={error} />
  }

  return (
    <>
      <WorkOrderDetails
        property={property}
        workOrder={workOrder}
        tenure={tenure}
        printClickHandler={printClickHandler}
        setLocationAlerts={setLocationAlerts}
        setPersonAlerts={setPersonAlerts}
      />

      <WorkOrderViewTabs
        propertyReference={property?.propertyReference}
        workOrderReference={workOrderReference}
        tasksAndSors={tasksAndSors}
        budgetCode={workOrder?.budgetCode}
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
  )
}

export default WorkOrderView
