import { useState, useEffect } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { WorkOrder } from '@/models/workOrder'
import { sortObjectsByDateKey } from '@/utils/date'
import PrintJobTicketDetails from './PrintJobTicketDetails'
import WorkOrderViewTabs from '../Tabs/Views/WorkOrderViewTabs'
import { CautionaryAlert } from '../../models/cautionaryAlerts'
import {
  getAppointmentDetails,
  getWorkOrderDetails,
  getWorkOrderTasks,
} from '../../utils/requests/workOrders'
import { APIResponseError } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { getPropertyTenureData } from '../../utils/requests/property'
import { Property, Tenure } from '../../models/propertyTenure'

const { NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL } = process.env

interface Props {
  workOrderReference: string
}

const WorkOrderView = ({ workOrderReference }: Props) => {
  const [workOrder, setWorkOrder] = useState<WorkOrder>()

  const [
    appointmentDetails,
    setAppointmentDetails,
  ] = useState<WorkOrderAppointmentDetails>()

  const [property, setProperty] = useState<Property>()
  const [tenure, setTenure] = useState<Tenure>()
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [locationAlerts, setLocationAlerts] = useState<CautionaryAlert[]>([])
  const [personAlerts, setPersonAlerts] = useState<CautionaryAlert[]>([])
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
      const [
        workOrderResponse,
        appointmetDetailsResponse,
        tasksAndSorsResponse,
      ] = await Promise.all([
        getWorkOrderDetails(workOrderReference),
        getAppointmentDetails(workOrderReference),
        getWorkOrderTasks(workOrderReference),
      ])

      if (!workOrderResponse.success) throw workOrderResponse.error
      if (!appointmetDetailsResponse.success)
        throw appointmetDetailsResponse.error
      if (!tasksAndSorsResponse.success) throw tasksAndSorsResponse.error

      setWorkOrder(new WorkOrder(workOrderResponse.response))
      setAppointmentDetails(
        new WorkOrderAppointmentDetails(appointmetDetailsResponse.response)
      )
      setTasksAndSors(
        sortObjectsByDateKey(
          tasksAndSorsResponse.response,
          ['dateAdded'],
          'dateAdded'
        )
      )

      const propertyTenureResponse = await getPropertyTenureData(
        workOrderResponse.response?.propertyReference
      )
      if (!propertyTenureResponse.success) throw propertyTenureResponse.error

      setProperty(() => propertyTenureResponse.response.property)
      if (propertyTenureResponse.response.tenure) {
        setTenure(() => propertyTenureResponse.response.tenure)
      }
    } catch (e) {
      setWorkOrder(null)
      setAppointmentDetails(null)
      setProperty(null)
      setTenure(null)

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
        appointmentDetails={appointmentDetails}
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
        appointmentDetails={appointmentDetails}
      />

      {/* Only displayed for print media */}
      <PrintJobTicketDetails
        workOrder={workOrder}
        appointmentDetails={appointmentDetails}
        property={property}
        tasksAndSors={tasksAndSors}
        locationAlerts={locationAlerts}
        personAlerts={personAlerts}
      />
    </>
  )
}

export default WorkOrderView
