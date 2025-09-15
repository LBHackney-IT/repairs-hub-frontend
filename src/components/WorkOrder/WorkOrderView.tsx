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
  getWorkOrderDetails,
  getWorkOrderTasks,
} from '../../utils/requests/workOrders'
import { APIResponseError } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import { getPropertyTenureData } from '../../utils/requests/property'
import { Property, Tenure } from '../../models/propertyTenure'
import { useAppointmentDetails } from './hooks/useAppointmentDetails'

const { NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL } = process.env

interface Props {
  workOrderReference: string
}

const WorkOrderView = ({ workOrderReference }: Props) => {
  const [workOrder, setWorkOrder] = useState<WorkOrder>()

  const [property, setProperty] = useState<Property>()
  const [tenure, setTenure] = useState<Tenure>()
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [alerts, setAlerts] = useState<CautionaryAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>()

  const {
    appointmentDetails,
    isLoading: loadingAppointmentDetails,
    error: appointmentDetailsError,
  } = useAppointmentDetails(workOrderReference)

  const printClickHandler = () => {
    if (loadingAppointmentDetails || appointmentDetailsError) {
      // disable print button when loading or error
      return
    }

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
    setIsLoading(() => true)

    try {
      const [workOrderResponse, tasksAndSorsResponse] = await Promise.all([
        getWorkOrderDetails(workOrderReference),
        getWorkOrderTasks(workOrderReference),
      ])

      if (!workOrderResponse.success) throw workOrderResponse.error
      setWorkOrder(new WorkOrder(workOrderResponse.response))

      if (!tasksAndSorsResponse.success) throw tasksAndSorsResponse.error
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
      console.error('An error has occured:', e.response)

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
    }

    setIsLoading(() => false)
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
        appointmentDetailsError={appointmentDetailsError}
        loadingAppointmentDetails={loadingAppointmentDetails}
        tenure={tenure}
        printClickHandler={printClickHandler}
        setAlerts={setAlerts}
      />

      <WorkOrderViewTabs
        propertyReference={property?.propertyReference}
        workOrderReference={workOrderReference}
        tasksAndSors={tasksAndSors}
        budgetCode={workOrder?.budgetCode}
        workOrder={workOrder}
        appointmentDetails={appointmentDetails}
        appointmentDetailsError={appointmentDetailsError}
        loadingAppointmentDetails={loadingAppointmentDetails}
      />

      {/* Only displayed for print media */}
      {!loadingAppointmentDetails && !appointmentDetailsError && (
        // Conditionally renders printable component. Print is disabled
        // if either of these are true
        <PrintJobTicketDetails
          workOrder={workOrder}
          appointmentDetails={appointmentDetails}
          property={property}
          tasksAndSors={tasksAndSors}
          alerts={alerts}
        />
      )}
    </>
  )
}

export default WorkOrderView
