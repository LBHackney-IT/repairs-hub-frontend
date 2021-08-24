import PropTypes from 'prop-types'
import { formatDateTime } from '../../../utils/time'
import { TR, TD } from '../../Layout/Table'

const tasksAndSorsRow = ({
  code,
  description,
  dateAdded,
  taskQuantity,
  cost,
  index,
  standardMinuteValue,
}) => (
  <TR index={index} className="lbh-body-s">
    <TD>{code}</TD>
    <TD>{description}</TD>
    <TD>{dateAdded ? formatDateTime(dateAdded) : '—'}</TD>
    <TD>{taskQuantity}</TD>
    <TD type="numeric">£{cost}</TD>
    <TD type="numeric">£{parseFloat(cost * taskQuantity).toFixed(2)}</TD>
    <TD type="numeric">{standardMinuteValue}</TD>
  </TR>
)

tasksAndSorsRow.propTypes = {
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dateAdded: PropTypes.instanceOf(Date).isRequired,
  taskQuantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  standardMinuteValue: PropTypes.number.isRequired,
}

export default tasksAndSorsRow
