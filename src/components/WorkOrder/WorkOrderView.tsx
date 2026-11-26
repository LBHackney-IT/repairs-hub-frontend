import { useCallback } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import WorkOrderPageHeading from './WorkOrderPageHeading'
import WorkOrderActionMenu from './WorkOrderActionMenu'
import SpinnerWithLabel from '../SpinnerWithLabel'
import ErrorMessage from '../Errors/ErrorMessage'
import PrintJobTicketDetails from './PrintJobTicketDetails'
import WorkOrderViewTabs from '../Tabs/Views/WorkOrderViewTabs'
import { useAppointmentDetails } from '@/requests/hooks/useAppointmentDetails'
import { useWorkOrderDetails } from '@/requests/hooks/useWorkOrderDetails'
import { useWorkOrderTasks } from '@/requests/hooks/useWorkOrderTasks'
import { usePropertyTenure } from '@/requests/hooks/usePropertyTenure'
import { useCautionaryAlerts } from '@/requests/hooks/useCautionaryAlerts'

const { NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL } = process.env

interface Props {
  workOrderReference: string
}

const WorkOrderView = ({ workOrderReference }: Props) => {
  const {
    workOrder,
    isLoading: workOrderLoading,
    error: workOrderError,
  } = useWorkOrderDetails(workOrderReference)

  const {
    tasksAndSors,
    isLoading: tasksLoading,
    error: tasksError,
  } = useWorkOrderTasks(workOrderReference)

  // The work order carries the property reference, so everything that
  // depends on the property starts as soon as the work order is available
  const propertyReference = workOrder?.propertyReference

  const {
    property,
    tenure,
    isLoading: propertyLoading,
    error: propertyError,
  } = usePropertyTenure(propertyReference)

  const { alerts, isLoading: alertsLoading, error: alertsError } = useCautionaryAlerts(
    propertyReference
  )

  const {
    appointmentDetails,
    isLoading: loadingAppointmentDetails,
    error: appointmentDetailsError,
  } = useAppointmentDetails(workOrderReference)

  // The print ticket needs all of the data, so printing waits for it
  const canPrint =
    !!workOrder &&
    !!property &&
    !!appointmentDetails &&
    !tasksLoading &&
    !tasksError &&
    !alertsLoading &&
    !loadingAppointmentDetails &&
    !appointmentDetailsError

  const printClickHandler = useCallback(() => {
    if (!canPrint) {
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
  }, [canPrint])

  // The details block waits for the work order and property so it appears in
  // one go rather than shifting as each part arrives. Appointment details and
  // alerts are the exceptions: they come from external services that can be
  // slow or never respond, so they load in place and don't hold the page up.
  const detailsLoading = workOrderLoading || propertyLoading

  const detailsReady = !workOrderError && !detailsLoading

  return (
    <>
      <div className="govuk-!-display-none-print">
        <WorkOrderPageHeading workOrderReference={workOrderReference}>
          {detailsReady && (
            <WorkOrderActionMenu
              workOrder={workOrder}
              printClickHandler={printClickHandler}
            />
          )}
        </WorkOrderPageHeading>

        {detailsReady ? (
          <WorkOrderDetails
            property={property}
            propertyError={propertyError}
            workOrder={workOrder}
            appointmentDetails={appointmentDetails}
            appointmentDetailsError={appointmentDetailsError}
            loadingAppointmentDetails={loadingAppointmentDetails}
            tenure={tenure}
            alerts={alerts}
            alertsError={alertsError}
          />
        ) : workOrderError ? (
          <ErrorMessage label={workOrderError} />
        ) : (
          <div className="govuk-!-margin-top-6">
            <SpinnerWithLabel label="Fetching work order…" />
          </div>
        )}

        {/* The tabs are mounted straight away, but kept hidden until the
            details above are ready, so the open tab loads its data in parallel
            instead of only starting once it becomes visible */}
        {!workOrderError && (
          <div style={detailsReady ? undefined : { display: 'none' }}>
            <WorkOrderViewTabs
              propertyReference={propertyReference}
              workOrderReference={workOrderReference}
              tasksAndSors={tasksAndSors}
              tasksAndSorsLoading={tasksLoading}
              tasksAndSorsError={tasksError}
              budgetCode={workOrder?.budgetCode}
              workOrder={workOrder}
              appointmentDetails={appointmentDetails}
              appointmentDetailsError={appointmentDetailsError}
              loadingAppointmentDetails={loadingAppointmentDetails}
            />
          </div>
        )}
      </div>

      {/* Only displayed for print media */}
      {canPrint && (
        // Conditionally renders printable component. Print is disabled
        // if the data it needs hasn't loaded
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
