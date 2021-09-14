import PropTypes from 'prop-types'
import BackButton from '../Layout/BackButton/BackButton'
import { longMonthWeekday } from '../../utils/date'
import { WorkOrder } from '../../models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'

const OperativeWorkOrderDetails = ({ property, workOrder, personAlerts }) => (
  <>
    <div className="govuk-panel govuk-panel--confirmation lbh-panel appointment-info">
      {workOrder.appointment ? (
        <h3 className="lbh-heading-h3">
          {longMonthWeekday(workOrder.appointment.date)}
          <br />
          {workOrder.appointment.start}-{workOrder.appointment.end}
        </h3>
      ) : (
        <h3 className="lbh-heading-h3">No appointment</h3>
      )}
    </div>
    <BackButton />

    <GridRow>
      <GridColumn width="one-half">
        <div className="lbh-heading-h3">
          WO {workOrder.reference.toString().padStart(8, '0')}
        </div>
      </GridColumn>
      <GridColumn width="one-half" className="align-grid-column">
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

    {workOrder.plannerComments && (
      <>
        <div className="lbh-heading-h3">Planner Comment</div>
        <p className="govuk-body">{workOrder.plannerComments}</p>
      </>
    )}

    {personAlerts.length > 0 && (
      <GridRow>
        <GridColumn width="one-half">
          <div className="lbh-heading-h3">Caut. contact</div>
        </GridColumn>
        <GridColumn width="one-half" className="align-grid-column">
          <div className="govuk-warning-text lbh-warning-text">
            <span
              class="govuk-warning-text__icon caut-contact--icon"
              aria-hidden="true"
            >
              !
            </span>
            <strong className="govuk-warning-text__text caut-contact--text">
              {personAlerts.map((alert) => alert.type).join(',')}
            </strong>
          </div>
        </GridColumn>
      </GridRow>
    )}
    <GridRow>
      <GridColumn width="one-half">
        <div className="lbh-heading-h3">Address</div>
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
          <div className="lbh-heading-h3">Contact</div>
        </GridColumn>
        <GridColumn width="one-half" className="align-grid-column">
          <div className="lbh-body">{workOrder.callerName}</div>
        </GridColumn>
      </GridRow>
    )}

    {workOrder.callerNumber && (
      <GridRow>
        <GridColumn width="one-half">
          <div className="lbh-heading-h3">Telephone no</div>
        </GridColumn>
        <GridColumn width="one-half" className="align-grid-column">
          <div className="lbh-body">{workOrder.callerNumber}</div>
        </GridColumn>
      </GridRow>
    )}

    {workOrder.appointment && workOrder.appointment.note && (
      <GridRow>
        <GridColumn width="one-half">
          <div className="lbh-heading-h3">Comment</div>
        </GridColumn>
        <GridColumn width="one-half" className="align-grid-column">
          <div className="lbh-body">{workOrder.appointment.note}</div>
        </GridColumn>
      </GridRow>
    )}
  </>
)

OperativeWorkOrderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default OperativeWorkOrderDetails
