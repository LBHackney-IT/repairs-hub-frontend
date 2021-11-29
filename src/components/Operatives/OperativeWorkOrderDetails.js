import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'
import TruncateText from '../Layout/TruncateText'

const OperativeWorkOrderDetails = ({
  property,
  workOrder,
  personAlerts,
  locationAlerts,
}) => {
  const cautionaryAlertComments = (() => {
    const comments = [locationAlerts, personAlerts]
      .flat(1)
      .map((alert) => alert.comments)
    return [...new Set(comments)]
  })()

  return (
    <>
      <div className="operative-work-order">
        <GridRow>
          <GridColumn width="one-half">
            <div className="lbh-heading-h3">
              WO {workOrder.reference.toString().padStart(8, '0')}
            </div>
          </GridColumn>
          <GridColumn
            width="one-half"
            className="align-grid-column priority-text"
          >
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
          </GridColumn>
        </GridRow>
        <div className="lbh-heading-h5">Description</div>
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

        {cautionaryAlertComments.length > 0 && (
          <GridRow>
            <GridColumn width="one-half">
              <div className="govuk-warning-text lbh-warning-text">
                <span className="govuk-warning-text__icon" aria-hidden="true">
                  !
                </span>
                <strong className="govuk-warning-text__text">
                  <span className="govuk-warning-text__assistive">Warning</span>
                  Caut. alerts
                </strong>
              </div>
            </GridColumn>
            <GridColumn width="one-half" className="align-grid-column">
              <div className="govuk-warning-text lbh-warning-text">
                {cautionaryAlertComments.map((comment, index) => (
                  <p
                    key={index}
                    className="lbh-body lbh-!-font-weight-bold text-dark-red"
                  >
                    {comment}
                  </p>
                ))}
              </div>
            </GridColumn>
          </GridRow>
        )}

        <GridRow>
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
          <GridRow>
            <GridColumn width="one-half">
              <div className="lbh-body property-name">Contact</div>
            </GridColumn>
            <GridColumn width="one-half" className="align-grid-column">
              <div className="lbh-body">{workOrder.callerName}</div>
            </GridColumn>
          </GridRow>
        )}

        {workOrder.callerNumber && (
          <GridRow>
            <GridColumn width="one-half">
              <div className="lbh-body property-name">Telephone no</div>
            </GridColumn>
            <GridColumn width="one-half" className="align-grid-column">
              <div className="lbh-body">{workOrder.callerNumber}</div>
            </GridColumn>
          </GridRow>
        )}

        {workOrder.appointment && workOrder.appointment.note && (
          <GridRow>
            <GridColumn width="one-half">
              <div className="lbh-body property-name">Comment</div>
            </GridColumn>
            <GridColumn width="one-half" className="align-grid-column">
              <div className="lbh-body">{workOrder.appointment.note}</div>
            </GridColumn>
          </GridRow>
        )}
      </div>
    </>
  )
}

OperativeWorkOrderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  personAlerts: PropTypes.array.isRequired,
  locationAlerts: PropTypes.array.isRequired,
}

export default OperativeWorkOrderDetails
