import PropTypes from 'prop-types'
import Link from 'next/link'

const OperativeWorkOrderListItem = ({ operativeWorkOrder, index }) => {
  return (
    <>
      <Link href={`/work-orders/${operativeWorkOrder.reference}`}>
        <li data-id={index} className="green-info-box">
          <div className="appointment-details">
            <p className="lbh-body lbh-!-font-weight-bold text-white">{`${operativeWorkOrder.appointment.start}-${operativeWorkOrder.appointment.end}`}</p>

            <p className="lbh-body lbh-!-font-weight-bold text-white">
              {operativeWorkOrder.priority}
            </p>
          </div>
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
}

export default OperativeWorkOrderListItem
