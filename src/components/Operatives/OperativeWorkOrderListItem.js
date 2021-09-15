import PropTypes from 'prop-types'
import Link from 'next/link'

const OperativeWorkOrderListItem = ({
  operativeWorkOrder,
  index,
  statusText,
}) => {
  return (
    <>
      <Link href={`/work-orders/${operativeWorkOrder.reference}`}>
        <li data-id={index} className="green-info-box">
          <div className="appointment-details">
            <p className="lbh-body lbh-!-font-weight-bold text-white">{`${operativeWorkOrder.appointment.start}-${operativeWorkOrder.appointment.end}`}</p>

            <p className="lbh-body lbh-!-font-weight-bold text-white capitalize">
              {operativeWorkOrder.priority.toLowerCase().split(' ').slice(-1)}
            </p>
          </div>
          {statusText && (
            <div className="lbh-body lbh-!-font-weight-bold text-white status-text">
              {statusText}
            </div>
          )}
          <div className="middle-right">
            <a className="arrow right"></a>
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
