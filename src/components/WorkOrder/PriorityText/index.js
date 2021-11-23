import cx from 'classnames'
import PropTypes from 'prop-types'
import { WorkOrder } from '../../../models/workOrder'

const PriorityText = ({ workOrder, className }) => {
  return (
    <span
      className={cx(
        { 'text-dark-red': workOrder.isHigherPriority() },
        className
      )}
    >
      {workOrder.priorityText()}
    </span>
  )
}

PriorityText.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  className: PropTypes.string,
}

export default PriorityText
