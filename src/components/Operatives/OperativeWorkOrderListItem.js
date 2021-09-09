import PropTypes from 'prop-types'

const OperativeWorkOrderListItem = ({ operativeWorkOrder }) => (
  <>
    <li className="green-info-box">
      <div className="appointment-details">
        <p className="lbh-body lbh-!-font-weight-bold text-white">{`${operativeWorkOrder.appointment.start}-${operativeWorkOrder.appointment.end}`}</p>

        <p className="lbh-body lbh-!-font-weight-bold text-white">
          {operativeWorkOrder.priority}
        </p>
      </div>
      <p className="middle-right">
        <i className="arrow right"></i>
      </p>
    </li>
  </>
)

OperativeWorkOrderListItem.propTypes = {
  operativeWorkOrder: PropTypes.object.isRequired,
}

export default OperativeWorkOrderListItem
