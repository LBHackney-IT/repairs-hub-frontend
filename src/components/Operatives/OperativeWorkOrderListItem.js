import PropTypes from 'prop-types'

const OperativeWorkOrderListItem = ({ operativeWorkOrders }) => (
  <>
    <ol className="lbh-list">
      {operativeWorkOrders.map((operativeWorkOrder, index) => (
        <li key={index} className="green-info-box" data-note-id={index}>
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
      ))}
    </ol>
  </>
)

OperativeWorkOrderListItem.propTypes = {
  operativeWorkOrders: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.number,
      dateRaised: PropTypes.string,
      lastUpdated: PropTypes.instanceOf(Date),
      priority: PropTypes.string,
      property: PropTypes.string,
      owner: PropTypes.string,
      description: PropTypes.string,
      propertyReference: PropTypes.string,
      tradeCode: PropTypes.string,
      tradeDescription: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
}

export default OperativeWorkOrderListItem
