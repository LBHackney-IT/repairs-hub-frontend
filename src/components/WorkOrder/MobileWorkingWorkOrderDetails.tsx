import { WorkOrder } from '@/models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'
import TruncateText from '../Layout/TruncateText'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import { useRouter } from 'next/router'
import { formatDateTime } from '../../utils/time'
import Status from './Status'
import { Property, Tenure } from '../../models/propertyTenure'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

interface Props {
  property: Property
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  tenure: Tenure
}

const MobileWorkingWorkOrderDetails = (props: Props) => {
  const { property, tenure, workOrder, appointmentDetails } = props

  const [alertsLoading, setAlertsLoading] = useState<boolean>(false)
  const [alertsError, setAlertsError] = useState<string | null>()
  const [alerts, setAlerts] = useState([])

  const router = useRouter()

  const cautionaryAlertsType = () => {
    const cautionaryAlerts = alerts.map(
      (cautionaryAlert) => cautionaryAlert.type
    )
    return [...new Set(cautionaryAlerts)].join(', ')
  }

  const cautContactURL = () => {
    router.push({
      pathname: `/work-orders/cautionary-alerts`,
      query: {
        cautContactCodes: cautionaryAlertsType(),
      },
    })
  }

  const getAlerts = (tenureId, propertyReference) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${tenureId}/${propertyReference}/alerts`,
    })
      .then((data) => setAlerts(data.alerts))
      .catch((error) => {
        console.error('Error loading alerts status:', error.response)

        setAlertsError(
          `Error loading alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setAlertsLoading(false))
  }

  useEffect(() => {
    setAlertsLoading(true)
    getAlerts(tenure.id, property.propertyReference)
  }, [])

  return (
    <>
      <div className="operative-work-order">
        <h1 className="lbh-heading-h1">
          WO&nbsp;{workOrder.reference.toString().padStart(8, '0')}
        </h1>

        <div>
          <Status
            text={workOrder?.status}
            className="lbh-body-xs work-order-status"
          />
        </div>
        <br></br>

        <div className="priority-text govuk-!-margin-top-0">
          {workOrder.isHigherPriority() ? (
            <h3 className="text-dark-red lbh-heading-h3">
              {' '}
              {workOrder.priority.toLowerCase().split(' ').slice(-1)}
            </h3>
          ) : (
            <h3 className="lbh-heading-h3">
              {' '}
              {workOrder.priority.toLowerCase().split(' ').slice(-1)}
            </h3>
          )}
        </div>
        <h4 className="lbh-heading-h4">Description</h4>
        <TruncateText
          text={workOrder.description}
          numberOfLines="3"
          pTagClassName={'govuk-body govuk-!-margin-bottom-0'}
          linkClassName={'govuk-body'}
        />

        {!!workOrder?.startTime && (
          <>
            <h5 className="lbh-heading-h5">Started At</h5>
            <p className="govuk-body" data-test="startedAtValue">
              {formatDateTime(workOrder.startTime)}
            </p>
          </>
        )}

        {appointmentDetails.plannerComments && (
          <>
            <h5 className="lbh-heading-h5">Planner Comment</h5>
            <p className="govuk-body">{appointmentDetails.plannerComments}</p>
          </>
        )}
        <div className="work-order-information">
          {alertsLoading && <Spinner resource="alerts" />}
          {alertsError && <ErrorMessage label={alertsError} />}

          {cautionaryAlertsType().length > 0 && (
            <GridRow className="govuk-!-margin-top-0">
              <GridColumn width="one-half">
                <a
                  className="lbh-heading-h5 lbh-link"
                  href="#"
                  id="caut-alerts"
                  onClick={cautContactURL}
                >
                  Caut. alerts
                </a>
              </GridColumn>
              <GridColumn width="one-half" className="govuk-!-margin-top-0">
                <div className="govuk-warning-text lbh-warning-text">
                  <span
                    className="govuk-warning-text__icon person-alert--icon"
                    aria-hidden="true"
                  >
                    !
                  </span>
                  <strong className="govuk-warning-text__text person-alert--text">
                    {cautionaryAlertsType()}
                  </strong>
                </div>
              </GridColumn>
            </GridRow>
          )}

          <GridRow className="govuk-!-margin-top-0">
            <GridColumn width="one-half">
              <div className="lbh-body property-name">Address</div>
            </GridColumn>
            <GridColumn width="one-half" className="align-grid-column">
              <div className="lbh-body">
                {property.address.shortAddress} {property.address.postalCode}
              </div>
            </GridColumn>
          </GridRow>

          {workOrder.callerName && (
            <GridRow className="govuk-!-margin-top-0">
              <GridColumn width="one-half">
                <div className="lbh-body property-name">Contact</div>
              </GridColumn>
              <GridColumn width="one-half" className="align-grid-column">
                <div className="lbh-body">{workOrder.callerName}</div>
              </GridColumn>
            </GridRow>
          )}

          {workOrder.callerNumber && (
            <GridRow className="govuk-!-margin-top-0">
              <GridColumn width="one-half">
                <div className="lbh-body property-name">Telephone no</div>
              </GridColumn>
              <GridColumn width="one-half" className="align-grid-column">
                <div className="lbh-body">
                  <a
                    className="lbh-link"
                    href={`tel:141${workOrder.callerNumber}`}
                    id="telephone-no"
                  >
                    {workOrder.callerNumber}
                  </a>
                </div>
              </GridColumn>
            </GridRow>
          )}

          {appointmentDetails.appointment &&
            appointmentDetails.appointment.note && (
              <GridRow className="govuk-!-margin-top-0">
                <GridColumn width="one-half">
                  <div className="lbh-body property-name">Comment</div>
                </GridColumn>
                <GridColumn width="one-half" className="align-grid-column">
                  <div className="lbh-body">
                    {appointmentDetails.appointment.note}
                  </div>
                </GridColumn>
              </GridRow>
            )}
        </div>
      </div>
    </>
  )
}

export default MobileWorkingWorkOrderDetails
