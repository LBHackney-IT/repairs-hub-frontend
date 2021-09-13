import PropTypes from 'prop-types'
import Link from 'next/link'

const OperativeWorkOrderListItem = ({ operativeWorkOrder, index }) => {
  return (
    <>
      <li data-id={index} className="green-info-box">
        <div className="appointment-details">
          <p className="lbh-body lbh-!-font-weight-bold text-white">{`${operativeWorkOrder.appointment.start}-${operativeWorkOrder.appointment.end}`}</p>

          <p className="lbh-body lbh-!-font-weight-bold text-white">
            {operativeWorkOrder.priority}
          </p>
        </div>
        <div className="middle-right">
          <Link href={`/work-orders/${operativeWorkOrder.reference}`}>
            <a className="arrow right" id="arrow-right"></a>
          </Link>
        </div>
      </li>
    </>
  )
}

OperativeWorkOrderListItem.propTypes = {
  operativeWorkOrder: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

export default OperativeWorkOrderListItem
