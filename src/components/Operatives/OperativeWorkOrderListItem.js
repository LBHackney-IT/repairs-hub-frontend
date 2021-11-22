import PropTypes from 'prop-types'
import Link from 'next/link'
import Status from '../WorkOrder/Status'

const OperativeWorkOrderListItem = ({
  operativeWorkOrder,
  index,
  statusText,
}) => {
  return (
    <>
      <Link href={`/work-orders/${operativeWorkOrder.reference}`}>
        <li data-id={index} className="appointment-info-box">
          <div className="appointment-details">
            <div>
              <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-display-inline ">
                {`${operativeWorkOrder.appointment.start} – ${operativeWorkOrder.appointment.end}`}
              </h3>

              {statusText && (
                <Status
                  text={statusText}
                  className="govuk-!-margin-top-0 govuk-!-margin-left-2 uppercase"
                />
              )}
            </div>

            <p className="lbh-body lbh-!-font-weight-bold govuk-!-margin-0 capitalize">
              {operativeWorkOrder.priority.toLowerCase().split(' ').slice(-1)}
            </p>

            <p className="lbh-body govuk-!-margin-0">
              {operativeWorkOrder.property}
            </p>
            <p className="lbh-body govuk-!-margin-0">
              {operativeWorkOrder.propertyPostCode}
            </p>

            <p className="lbh-body govuk-!-margin-0">
              {operativeWorkOrder.description}
            </p>
          </div>
          <div className="govuk-!-margin-0">
            <span className="arrow right"></span>
          </div>
        </li>
      </Link>
    </>
  )
}

OperativeWorkOrderListItem.propTypes = {
  operativeWorkOrder: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  statusText: PropTypes.string,
}

export default OperativeWorkOrderListItem
