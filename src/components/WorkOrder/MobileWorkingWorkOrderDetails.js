import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'
import TruncateText from '../Layout/TruncateText'
import { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import { useRouter } from 'next/router'
import { getCautionaryAlertsType } from '@/utils/cautionaryAlerts'

const MobileWorkingWorkOrderDetails = ({ property, tenure, workOrder }) => {
  const [cautionaryAlertsLoading, setCautionaryAlertsLoading] = useState(false)
  const [cautionaryAlertsError, setCautionaryAlertsError] = useState()
  const [cautionaryAlerts, setCautionaryAlerts] = useState([])

  const router = useRouter()

  const getAllAlertTypes = () =>
    getCautionaryAlertsType([ ...cautionaryAlerts ])

  const cautContactURL = () => {
    router.push({
      pathname: `/work-orders/cautionary-alerts`,
      query: {
        cautContactCodes: getAllAlertTypes().join(', '),
      },
    })
  }

  const getCautionaryAlerts = (propertyReference) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/${propertyReference}/location-alerts`,
    })
      .then((data) => setCautionaryAlerts(data.alerts))
      .catch((error) => {
        console.error('Error loading cautionary alerts status:', error.response)

        setCautionaryAlertsError(
          `Error loading cautionary alerts status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setCautionaryAlertsLoading(false))
  }

  useEffect(() => {
    setCautionaryAlertsLoading(true)
    getCautionaryAlerts(property.propertyReference)
  }, [])

  return (
    <>
      <div className="operative-work-order">
        <h1 className="lbh-heading-h1">
          WO&nbsp;{workOrder.reference.toString().padStart(8, '0')}
        </h1>
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
        ></TruncateText>

        {workOrder.plannerComments && (
          <>
            <h5 className="lbh-heading-h5">Planner Comment</h5>
            <p className="govuk-body">{workOrder.plannerComments}</p>
          </>
        )}
        <div className="work-order-information">
          {cautionaryAlertsLoading && <Spinner resource="cautionaryAlerts" />}
          {cautionaryAlertsError && <ErrorMessage label={cautionaryAlertsError} />}

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

          {workOrder.appointment && workOrder.appointment.note && (
            <GridRow className="govuk-!-margin-top-0">
              <GridColumn width="one-half">
                <div className="lbh-body property-name">Comment</div>
              </GridColumn>
              <GridColumn width="one-half" className="align-grid-column">
                <div className="lbh-body">{workOrder.appointment.note}</div>
              </GridColumn>
            </GridRow>
          )}
        </div>
      </div>
    </>
  )
}

MobileWorkingWorkOrderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  tenure: PropTypes.object,
}

export default MobileWorkingWorkOrderDetails
