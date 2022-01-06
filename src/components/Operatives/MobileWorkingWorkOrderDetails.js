import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'
import { useRouter } from 'next/router'
import { getCautionaryAlertsType } from '@/utils/cautionaryAlerts'
import TruncateText from '../Layout/TruncateText'

const MobileWorkingWorkOrderDetails = ({
  property,
  workOrder,
  personAlerts,
  locationAlerts,
}) => {
  const router = useRouter()
  const cautionaryAlertsType = getCautionaryAlertsType(
    locationAlerts,
    personAlerts
  )

  const cautContactURL = () => {
    router.push({
      pathname: `/work-orders/cautionary-alerts`,
      query: {
        cautContactCodes: cautionaryAlertsType,
      },
    })
  }

  return (
    <>
      <div className="operative-work-order">
        <h1 className="lbh-heading-h1">
          WO&nbsp;{workOrder.reference.toString().padStart(8, '0')}
        </h1>
        <div className="priority-text govuk-!-margin-top-0">
          {workOrder.isHigherPriority() ? (
            <div className="text-dark-red lbh-heading-h3">
              {' '}
              {workOrder.priority.toLowerCase().split(' ').slice(-1)}
            </div>
          ) : (
            <div className="lbh-heading-h3">
              {' '}
              {workOrder.priority.toLowerCase().split(' ').slice(-1)}
            </div>
          )}
        </div>
        <div className="lbh-heading-h4">Description</div>
        <TruncateText
          text={workOrder.description}
          numberOfLines="3"
          pTagClassName={'govuk-body govuk-!-margin-bottom-0'}
          linkClassName={'govuk-body'}
        ></TruncateText>

        {workOrder.plannerComments && (
          <>
            <div className="lbh-heading-h5">Planner Comment</div>
            <p className="govuk-body">{workOrder.plannerComments}</p>
          </>
        )}
        <div className="work-order-information">
          {cautionaryAlertsType && (
            <GridRow className="align-grid-row">
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
              <GridColumn width="one-half" className="align-grid-column">
                <div className="govuk-warning-text lbh-warning-text">
                  <span
                    className="govuk-warning-text__icon person-alert--icon"
                    aria-hidden="true"
                  >
                    !
                  </span>
                  <strong className="govuk-warning-text__text person-alert--text">
                    {cautionaryAlertsType}
                  </strong>
                </div>
              </GridColumn>
            </GridRow>
          )}

          <GridRow className="align-grid-row">
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
            <GridRow className="align-grid-row">
              <GridColumn width="one-half">
                <div className="lbh-body property-name">Contact</div>
              </GridColumn>
              <GridColumn width="one-half" className="align-grid-column">
                <div className="lbh-body">{workOrder.callerName}</div>
              </GridColumn>
            </GridRow>
          )}

          {workOrder.callerNumber && (
            <GridRow className="align-grid-row">
              <GridColumn width="one-half">
                <div className="lbh-body property-name">Telephone no</div>
              </GridColumn>
              <GridColumn width="one-half" className="align-grid-column">
                <div className="lbh-body">{workOrder.callerNumber}</div>
              </GridColumn>
            </GridRow>
          )}

          {workOrder.appointment && workOrder.appointment.note && (
            <GridRow className="align-grid-row">
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
  personAlerts: PropTypes.array.isRequired,
  locationAlerts: PropTypes.array.isRequired,
}

export default MobileWorkingWorkOrderDetails
