import { WorkOrder } from '@/models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'
import TruncateText from '../Layout/TruncateText'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import { useRouter } from 'next/router'
import { getCautionaryAlertsType } from '@/utils/cautionaryAlerts'
import { formatDateTime } from '../../utils/time'
import Status from './Status'
import { Property } from '../../models/propertyTenure'
import { Tenure } from '../../models/tenure'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

interface Props {
  property: Property
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  tenure: Tenure
}

const MobileWorkingWorkOrderDetails = (props: Props) => {
  const { property, tenure, workOrder, appointmentDetails } = props

  const [locationAlertsLoading, setLocationAlertsLoading] = useState<boolean>(
    false
  )
  const [locationAlertsError, setLocationAlertsError] = useState<
    string | null
  >()
  const [locationAlerts, setLocationAlerts] = useState([])

  const [personAlertsLoading, setPersonAlertsLoading] = useState<boolean>(false)
  const [personAlertsError, setPersonAlertsError] = useState<string | null>()
  const [personAlerts, setPersonAlerts] = useState([])

  const router = useRouter()

  const getAllAlertTypes = () =>
    getCautionaryAlertsType([...locationAlerts, ...personAlerts])

  const cautContactURL = () => {
    router.push({
      pathname: `/work-orders/cautionary-alerts`,
      query: {
        cautContactCodes: getAllAlertTypes().join(', '),
      },
    })
  }

  const getLocationAlerts = (propertyReference) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/location-alerts`,
    })
      .then((data) => setLocationAlerts(data.alerts))
      .catch((error) => {
        console.error('Error loading location alerts status:', error.response)

        setLocationAlertsError(
          `Error loading location alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setLocationAlertsLoading(false))
  }

  const getPersonAlerts = (tenureId) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${tenureId}/person-alerts`,
    })
      .then((data) => setPersonAlerts(data.alerts))
      .catch((error) => {
        console.error('Error loading person alerts status:', error.response)

        setPersonAlertsError(
          `Error loading person alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setPersonAlertsLoading(false))
  }

  useEffect(() => {
    setLocationAlertsLoading(true)
    getLocationAlerts(property.propertyReference)
    if (tenure?.id) {
      setPersonAlertsLoading(true)
      getPersonAlerts(tenure.id)
    }
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
          {locationAlertsLoading && <Spinner resource="locationAlerts" />}
          {locationAlertsError && <ErrorMessage label={locationAlertsError} />}

          {personAlertsLoading && <Spinner resource="personAlerts" />}
          {personAlertsError && <ErrorMessage label={personAlertsError} />}

          {getAllAlertTypes().length > 0 && (
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
                    {getAllAlertTypes().join(', ')}
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
