import PropTypes from 'prop-types'
import BackButton from '../Layout/BackButton/BackButton'
import { longMonthWeekday } from '../../utils/date'
import { WorkOrder } from '../../models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'

const WorkOrderDetails = ({ property, workOrder, personAlerts }) => {
  const showCautContacts = (alerts) => {
    const allAlerts = []
    alerts.forEach((alert) => allAlerts.push(alert.type))
    return allAlerts.toString()
  }
  return (
    <>
      <div class="govuk-panel govuk-panel--confirmation lbh-panel appointment-info">
        {workOrder.appointment ? (
          <h3 class="lbh-heading-h3">
            {longMonthWeekday(workOrder.appointment.date)}
            <br />
            {workOrder.appointment.start}-{workOrder.appointment.end}
          </h3>
        ) : (
          <h3 class="lbh-heading-h3">No appointment</h3>
        )}
      </div>
      <BackButton />

      <GridRow>
        <GridColumn width="one-half-at-mobile">
          <div className="lbh-heading-h3">
            WO {workOrder.reference.toString().padStart(8, '0')}
          </div>
        </GridColumn>
        <GridColumn width="one-half-at-mobile" className="allign-grid-column">
          {workOrder.isHigherPriority() ? (
            <div className="lbh-body text-dark-red ">
              {' '}
              {workOrder.priority.split(' ').slice(-1)}
            </div>
          ) : (
            <div className="lbh-body">
              {' '}
              {workOrder.priority.split(' ').slice(-1)}
            </div>
          )}
        </GridColumn>
      </GridRow>
      <div className="lbh-heading-h3">Description</div>
      <p className="govuk-body">{workOrder.description}</p>

      {personAlerts.length > 0 && (
        <GridRow>
          <GridColumn width="one-half-at-mobile">
            <div className="lbh-heading-h2">Caut. contact</div>
          </GridColumn>
          <GridColumn width="one-half-at-mobile" className="allign-grid-column">
            <div class="govuk-warning-text lbh-warning-text">
              <span
                class="govuk-warning-text__icon caut-contact-icon"
                aria-hidden="true"
              >
                !
              </span>
              <strong class="govuk-warning-text__text caut-contact-text">
                {showCautContacts(personAlerts)}
              </strong>
            </div>
          </GridColumn>
        </GridRow>
      )}
      <GridRow>
        <GridColumn width="one-half-at-mobile">
          <div className="lbh-heading-h2">Address</div>
        </GridColumn>
        <GridColumn width="one-half-at-mobile" className="allign-grid-column">
          <div className="lbh-body">
            {property.address.shortAddress} {property.address.postalCode}
          </div>
        </GridColumn>
      </GridRow>

      {workOrder.callerName && (
        <GridRow>
          <GridColumn width="one-half-at-mobile">
            <div className="lbh-heading-h2">Contact</div>
          </GridColumn>
          <GridColumn width="one-half-at-mobile" className="allign-grid-column">
            <div className="lbh-body">{workOrder.callerName}</div>
          </GridColumn>
        </GridRow>
      )}

      {workOrder.callerNumber && (
        <GridRow>
          <GridColumn width="one-half-at-mobile">
            <div className="lbh-heading-h2">Telephone no</div>
          </GridColumn>
          <GridColumn width="one-half-at-mobile" className="allign-grid-column">
            <div className="lbh-body">{workOrder.callerNumber}</div>
          </GridColumn>
        </GridRow>
      )}

      {workOrder.appointment && workOrder.appointment.note && (
        <GridRow>
          <GridColumn width="one-half-at-mobile">
            <div className="lbh-heading-h2">Comment</div>
          </GridColumn>
          <GridColumn width="one-half-at-mobile" className="allign-grid-column">
            <div className="lbh-body">{workOrder.appointment.note}</div>
          </GridColumn>
        </GridRow>
      )}
    </>
  )
}

WorkOrderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default WorkOrderDetails
