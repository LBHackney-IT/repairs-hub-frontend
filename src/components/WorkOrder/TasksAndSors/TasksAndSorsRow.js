import PropTypes from 'prop-types'
import { TR, TD } from '../../Layout/Table'

const tasksAndSorsRow = ({
  showOperativeTasksAndSorsRow,
  code,
  description,
  taskQuantity,
  cost,
  index,
  standardMinuteValue,
  quantity,
  isOriginal,
  originalQuantity,
}) => {
  return !showOperativeTasksAndSorsRow ? (
    <TR index={index} className="lbh-body-s">
      <TD>{code}</TD>
      <TD>{description}</TD>
      <TD>{taskQuantity}</TD>
      <TD type="numeric">{taskQuantity === 0 ? '-' : `£${cost}`}</TD>
      <TD type="numeric">
        {taskQuantity === 0
          ? '-'
          : `£${parseFloat(cost * taskQuantity).toFixed(2)}`}
      </TD>
      <TD type="numeric">
        {' '}
        {taskQuantity === 0
          ? '-'
          : isOriginal
          ? standardMinuteValue * originalQuantity
          : standardMinuteValue * quantity}
      </TD>
    </TR>
  ) : (
    <TR index={index} className="lbh-body">
      <TD>{taskQuantity}</TD>
      <TD>{code}</TD>
      <TD>{description}</TD>
      <TD type="numeric">{standardMinuteValue * quantity}</TD>
    </TR>
  )
}

tasksAndSorsRow.propTypes = {
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  taskQuantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  standardMinuteValue: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  isOriginal: PropTypes.bool,
  originalQuantity: PropTypes.number,
}

export default tasksAndSorsRow
