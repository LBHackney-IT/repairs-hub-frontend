import PropTypes from 'prop-types'
import BackButton from '../Layout/BackButton'
import { longMonthWeekday } from '../../utils/date'
import { WorkOrder } from '../../models/workOrder'
import { GridColumn, GridRow } from '../Layout/Grid'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { getCautionaryAlertsType } from '../../utils/cautionaryAlerts'

const OperativeWorkOrderDetails = ({
  property,
  workOrder,
  personAlerts,
  locationAlerts,
}) => {
  const router = useRouter()
  const [textOverflow, setTextOverflow] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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

  const onShowMoreClick = () => {
    setIsExpanded(true)
  }

  const onShowLessClick = () => {
    setIsExpanded(false)
  }

  const pRef = useCallback((node) => {
    if (node != null) {
      if (node.scrollHeight > node.clientHeight) {
        setTextOverflow(true)
      }
    }
  })

  return (
    <>
      <div className="operative-work-order">
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
        <p
          ref={pRef}
          className={`govuk-body govuk-!-margin-bottom-0 ${
            isExpanded ? '' : 'truncate'
          }`}
        >
          {workOrder.description}
        </p>
        {textOverflow ? (
          !isExpanded ? (
            <a
              className="govuk-body lbh-link"
              href="#"
              onClick={onShowMoreClick}
            >
              show more
            </a>
          ) : (
            <a
              className="govuk-body lbh-link"
              href="#"
              onClick={onShowLessClick}
            >
              show less
            </a>
          )
        ) : (
          ''
        )}
        {workOrder.plannerComments && (
          <>
            <div className="lbh-heading-h5">Planner Comment</div>
            <p className="govuk-body">{workOrder.plannerComments}</p>
          </>
        )}

        {cautionaryAlertsType && (
          <GridRow>
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
